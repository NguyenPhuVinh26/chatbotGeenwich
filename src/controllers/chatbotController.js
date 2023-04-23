require("dotenv").config();
import request from "request";
import chatbotService from "../services/chatbotService";
import moment from "moment";
import { cache } from "ejs";

const { GoogleSpreadsheet } = require('google-spreadsheet');

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const SPEADSHEET_ID = process.env.SPEADSHEET_ID;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;


let writeDataToGoogleSheet = async (data) => {

  let currentDate = new Date();
  const format = "HH:mm DD/MM/YYYY"
  let formatedDate = new Date().toLocaleString("vi-VN", { timeZone: 'Asia/Ho_Chi_Minh' })

  // Initialize the sheet - doc ID is the long id in the sheets URL
  const doc = new GoogleSpreadsheet(SPEADSHEET_ID);

  // Initialize Auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
  await doc.useServiceAccountAuth({
    // env var values are copied from service account credentials generated by google
    // see "Authentication" section in docs for more info
    client_email: JSON.parse(`"${GOOGLE_SERVICE_ACCOUNT_EMAIL}"`),
    private_key: JSON.parse(`"${GOOGLE_PRIVATE_KEY}"`),
  });

  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

  //append rows
  await sheet.addRow(
    {
      "Facebook name": data.username,
      "Email address": data.email,
      "Phone number": data.phoneNumber,
      "Time": formatedDate,
      "Customer name": data.customerName,
      "Address": data.addressCustomer,
      "Major": data.InformationTechnology,
      "Apply for admission in": data.CanTho,
    });
}

let getHomePage = (req, res) => {
  return res.render('homepage.ejs')
};

let postWebhook = (req, res) => {

  let body = req.body;

  if (body.object == 'page') {

    body.entry.forEach(function (entry) {
      if (entry.standby) {
        let webhook_standby = entry.standby[0];
        if (webhook_standby && webhook_standby.message) {
          if (webhook_standby.message.text === "back" || webhook_standby.message.text === "exit") {
            chatbotService.takeControlConversation(webhook_standby.sender.id);
          }
        }
        return;
      }
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
};

let getWebhook = (req, res) => {

  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode == 'subscribe' && token == VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};

// Handles messages events
async function handleMessage(sender_psid, received_message) {
  let response;
  //check messages for quick replies

  if (received_message.quick_reply && received_message.quick_reply.payload) {
    if (received_message.quick_reply.payload === 'MAIN_MENU') {
      await chatbotService.handleSendMainMenu(sender_psid);
    }
    if (received_message.quick_reply.payload === 'GUIDE_TO_USE') {
      await chatbotService.handleGuideToUseBot(sender_psid);
    }

    return;
  }

  // Checks if the message contains text
  if (received_message.text === "Hello" || received_message.text === "Hi" || received_message.text === "hello" || received_message.text === "hi") {
    // Create the payload for a basic text message, which
    response = {
      "text": `Welcome Vĩnh Nguyễn to Greenwich university CT!, May I help you?`
    }
  } else if (received_message.text === "Majors does Greenwich School have?" || received_message.text === "Majors") {
    let response1 = { "text": `Above are the majors that the school is training.` };
    await chatbotService.handleSendRecruitMenu(sender_psid);
    await callSendAPI(sender_psid, response1);
  } else if (received_message.text === "Information technology" || received_message.text === "Information about the IT industry") {
    let response1 = { "text": `Here is the information on the information technology industry` };
    await chatbotService.handleDetailViewAdmission(sender_psid);
    await callSendAPI(sender_psid, response1);
  } else if (received_message.text === "Design" || received_message.text === "Information about the design industry") {
    let response1 = { "text": `Here is the information on the Graphic & Digital Design industry` };
    await chatbotService.handleDetailViewTranscript(sender_psid);
    await callSendAPI(sender_psid, response1);
  } else if (received_message.text === "Business" || received_message.text === "Information about the business industry") {
    let response1 = { "text": `Here is the information on the Business administration industry` };
    await chatbotService.handleDetailViewTranscript2(sender_psid);
    await callSendAPI(sender_psid, response1);
  } else if (received_message.text === "Marketing" || received_message.text === "Information about the marketing industry") {
    let response1 = { "text": `Here is the information on the Marketing manager industry` };
    await chatbotService.handleDetailViewMarketting(sender_psid);
    await callSendAPI(sender_psid, response1);
  } else if (received_message.text === "Scholarship") {
    let response1 = { "text": `Here is the information on the Scholarship` };
    await chatbotService.handleSendMainMenuScholarship(sender_psid);
    await callSendAPI(sender_psid, response1);
  } else if (received_message.text === "Thanks" || received_message.text === "Good bye") {
    let response1 = { "text": `Thank you for the experience of using bots, hope you will be a student of Greenwich in the future.` };
    await callSendAPI(sender_psid, response1);
  } else if (received_message.text === "Menu" || received_message.text === "Show me menu") {
    await chatbotService.handleGetStarted(sender_psid);
  } else if (received_message.text === "What your name?") {
    let response1 = { "text": `My name is UoG bot, I am here to assist you in finding information about the University of Greenwich. I hope the information from me can help you.` };
    await callSendAPI(sender_psid, response1);
  } else if (received_message.text === "Where can I register directly?") {
    let response1 = {
      "text": `
      ----AT HANOI
      GOLDEN PARK Building - No. 2 Pham Van Bach - Yen Hoa - Cau Giay.
      Phone: 024.7300.2266 \n
      AT DA NANG
      658 Ngo Quyen - Son Tra District - Da Nang City
      Phone: 0236.730.2266 \n
      AT HO CHI MINH CITY
      20 Cong Hoa Street – Ward 12 – Tan Binh District
      Phone: 028.7300.2266 \n
      AT CAN THO
      No. 160, 30/4 Street - An Phu Ward - Ninh Kieu District - City. Can Tho
      Phone: 0292.730.0068` };
    await callSendAPI(sender_psid, response1);
  } else if (received_message.text === "How can I register online?") {
    let response1 = {
      "text": `Step 1: Fill in the registration form and click 'Done'.
Step 2: You need to download the PDF file and fill in your complete information, the consultant will contact you and guide you in detail.` };
    await chatbotService.handleSendMainMenuRegisterOnline(sender_psid);
    await callSendAPI(sender_psid, response1);
  }
  else {
    response = {
      "text": `I'm sorry, I don't understand what you mean. Can you please provide more information or clarify your question?`
    }
  }
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;
  // Set the response based on the postback payload
  switch (payload) {
    case 'CARE_HELP':
      response = { "text": `You turn off the bot. Some real will be with you in a few minute.` },
        await chatbotService.passTheadControl(sender_psid);
      break;

    case 'RESTART_BOT':
    case 'GET_STARTED':
      await chatbotService.handleGetStarted(sender_psid);
      break;

    case 'MAIN_MENU':
      await chatbotService.handleSendMainMenu(sender_psid);
      break;
    case 'GUIDE_TO_USE':
      await chatbotService.handleGuideToUseBot(sender_psid);
      break;
    case 'RECRUITMENT_INFORMATION':
      await chatbotService.handleSendRecruitMenu(sender_psid);
      break;

    case 'TRAINING_SPECIALISTS':
      await chatbotService.handleSendTrainingMenu(sender_psid);
      break;

    case 'VIEW_ADMISSION':
      await chatbotService.handleDetailViewAdmission(sender_psid)
      break;

    case 'VIEW_TRANSCRIPT':
      await chatbotService.handleDetailViewTranscript(sender_psid)
      break;

    case 'VIEW_TRANSCRIPT_2':
      await chatbotService.handleDetailViewTranscript2(sender_psid)
      break;

    case 'VIEW_MARKETTING':
      await chatbotService.handleDetailViewMarketting(sender_psid)
      break;
    case 'BACK_TO_MAIN_MENU':
      await chatbotService.handleBackToMainMenu(sender_psid);
      break;

    case 'SHOW_SCHOLARSHIP':
      await chatbotService.handleshowDetailScholarship(sender_psid);
      break;
    default:
      response = { "text": `oop! I don't know response with posback ${payload}` }
  }

  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

let setupProfile = async (req, res) => {
  //call profile facebook api
  // Construct the message body
  let request_body = {
    "get_started": { "payload": "GET_STARTED" },
    "whitelisted_domains": ["https://chatbotuniversitydemo.herokuapp.com/"]
  }

  // Send the HTTP request to the Messenger Platform
  await request({
    "uri": `https://graph.facebook.com/v9.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    console.log(body);
    if (!err) {
      console.log('Setup user profile succeeds');
    } else {
      console.error("Unable to Setup user profile:" + err);
    }
  });

  return res.send("Setup user profile succeeds");
}

let setupPersistentMenu = async (req, res) => {
  try {
    await chatbotService.setupPersistentMenuService();
    return res.redirect("/");

  } catch (e) {
    console.log(e);
  }
};

let handleRerserveRegister = (req, res) => {
  let senderId = req.params.senderId;
  return res.render('reserve-register-online.ejs', {
    senderId: senderId
  });
}

let handlePostReserveRegister = async (req, res) => {
  try {
    let username = await chatbotService.getUserName(req.body.psid);
    //write data to google sheet
    let data = {
      username: username,
      email: req.body.email,
      phoneNumber: `'${req.body.phoneNumber}`,
      customerName: req.body.customerName,
      addressCustomer: req.body.addressCustomer,
      InformationTechnology: req.body.InformationTechnology,
      GraphicDesign: req.body.GraphicDesign,
      CanTho: req.body.CanTho,
    }
    await writeDataToGoogleSheet(data);

    let customerName = "";
    if (req.boy.customerName === "") {
      customerName = username;
    } else customerName = req.body.customerName;

    let response1 = {
      "text": `---Student information---
      \nFull name: ${customerName}
      \nEmail address: ${req.body.email}
      \nPhone number: ${req.body.phoneNumber}
      \nAddress: ${req.body.addressCustomer}
      \nInformationTechnology: ${req.body.InformationTechnology}
      \CanTho: ${req.body.CanTho}
      `
    };

    await chatbotService.callSendAPI(req.body.psid, response1);

    return res.status(200).json({
      message: "ok"
    });
  } catch (e) {
    console.log('Erorr post register:', e)
    return res.status(500).json({
      message: 'Server error'
    });
  }
}

let handleViewIT = (req, res) => {
  return res.render('view-it.ejs');
}
let handleViewTuition = (req, res) => {
  return res.render('view-tuition.ejs');
}
let handleViewItAdmissions = (req, res) => {
  return res.render('view-it-admissions.ejs');
}
let handleViewDesign = (req, res) => {
  return res.render('view-design.ejs');
}
let handleViewBusiness = (req, res) => {
  return res.render('view-business.ejs');
}
let handleViewMarketting = (req, res) => {
  return res.render('view-marketting.ejs');
}
let handleViewScholarship = (req, res) => {
  return res.render('view-scholarship.ejs');
}
let handleViewOJT = (req, res) => {
  return res.render('view-ojt.ejs');
}
let handleViewPDP = (req, res) => {
  return res.render('view-pdp.ejs');
}
let handleViewQuestion = (req, res) => {
  return res.render('view-question.ejs');
}
let handleViewInformation = (req, res) => {
  return res.render('view-information.ejs');
}
module.exports = {
  getHomePage: getHomePage,
  getWebhook: getWebhook,
  postWebhook: postWebhook,
  setupProfile: setupProfile,
  setupPersistentMenu: setupPersistentMenu,
  handleRerserveRegister: handleRerserveRegister,
  handlePostReserveRegister: handlePostReserveRegister,
  writeDataToGoogleSheet: writeDataToGoogleSheet,
  handleViewIT: handleViewIT,
  handleViewTuition: handleViewTuition,
  handleViewItAdmissions: handleViewItAdmissions,
  handleViewDesign: handleViewDesign,
  handleViewBusiness: handleViewBusiness,
  handleViewMarketting: handleViewMarketting,
  handleViewScholarship: handleViewScholarship,
  handleViewOJT: handleViewOJT,
  handleViewPDP: handleViewPDP,
  handleViewQuestion: handleViewQuestion,
  handleViewInformation, handleViewInformation,
}