import { response } from "express";
import request from "request";
require("dotenv").config();
import db from '../models/index';

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED = 'https://bit.ly/chatbotvinhnguyen-1';
const IMAGE_MAIN_MENU_2 = 'https://bit.ly/chatbotvinhnguyen-2';
const IMAGE_MAIN_MENU_3 = 'https://bit.ly/chatbotvinhnguyen-3';
const IMAGE_MAIN_MENU_4 = 'https://bit.ly/chatbotvinhnguyen-4';

const IMAGE_VIEW_ADMISSION = 'https://bit.ly/chatbotvinhnguyen-5-2';
const IMAGE_VIEW_TRANSCRIPT = 'https://bit.ly/chatbotvinhnguyen-6';
const IMAGE_VIEW_TRANSCRIPT_2 = 'https://bit.ly/chatbotvinhnguyen-7';

const IMAGE_BACK_MAIN_MENU = 'https://bit.ly/chatbotvinhnguyen-8';

const IMAGE_DETAIL_ADMISSION_1 = 'https://bit.ly/chatbotvinhnguyen-9';
const IMAGE_DETAIL_ADMISSION_2 = 'https://bit.ly/chatbotvinhnguyen-10';
const IMAGE_DETAIL_ADMISSION_3 = 'https://bit.ly/chatbotvinhnguyen-11';

const IMAGE_DETAIL_TRANSCRIPT_1 = 'https://bit.ly/chatbotvinhnguyen-12';
const IMAGE_DETAIL_TRANSCRIPT_2 = 'https://bit.ly/chatbotvinhnguyen-13';
const IMAGE_DETAIL_TRANSCRIPT_3 = 'https://bit.ly/chatbotvinhnguyen-14';

const IMAGE_DETAIL_TRANSCRIPT_2_1 = 'https://bit.ly/chatbotvinhnguyen-15';
const IMAGE_DETAIL_TRANSCRIPT_2_2 = 'https://bit.ly/chatbotvinhnguyen-16';
const IMAGE_DETAIL_TRANSCRIPT_2_3 = 'https://bit.ly/chatbotvinhnguyen-17';


const IMAGE_DETAIL_SCHOLARSHIP = 'https://bit.ly/chatbotvinhnguyen-18';

const IMAGE_WELCOME = 'https://bit.ly/chatbotvinhnguyen-1-vd10';

const IMAGE_VIEW_DESIGN = 'https://bit.ly/image-design-vinhnguyen1';

const IMAGE_VIEW_IFM = 'https://s3.ap-south-1.amazonaws.com/blogassets.leverageedu.com/media/uploads/2022/01/26200757/Check-out-the-List-of-Notable-Alumni-at-University-of-Greenwich-1.jpg';

const IMAGE_VIEW_DETAILSREGISTER = 'https://bit.ly/image-form-register';

const PAGE_INBOX_ID = process.env.PAGE_INBOX_ID;


let callSendAPI = async (sender_psid, response) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Construct the message body
      let request_body = {
        "recipient": {
          "id": sender_psid
        },
        "message": response
      }

      await sendMarkReadMessage(sender_psid);
      await sendTypingOn(sender_psid);

      // Send the HTTP request to the Messenger Platform
      request({
        "uri": "https://graph.facebook.com/v9.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
      }, (err, res, body) => {
        console.log("----------------")
        console.log(body)
        console.log("----------------")
        if (!err) {
          resolve('message sent!')
        } else {
          console.error("Unable to send message:" + err);
        }
      });

    } catch (e) {
      reject(e);
    }
  })

}

let sendTypingOn = (sender_psid) => {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "sender_action": "typing_on"
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v9.0/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('sendTypingOn sent!')
    } else {
      console.error("Unable to send sendTypingOn:" + err);
    }
  });
}

let sendMarkReadMessage = (sender_psid) => {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "sender_action": "mark_seen"
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v9.0/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('sendTypingOn sent!')
    } else {
      console.error("Unable to send sendTypingOn:" + err);
    }
  });
}

let getUserName = (sender_psid) => {
  return new Promise((resolve, reject) => {
    // Send the HTTP request to the Messenger Platform
    request({
      "uri": `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
      "qs": { "access_token": PAGE_ACCESS_TOKEN },
      "method": "GET",
    }, (err, res, body) => {
      console.log(body)
      if (!err) {
        body = JSON.parse(body);
        let username = `${body.first_name} ${body.last_name}`;
        resolve(username);
      } else {
        console.error("Unable to send message:" + err);
        reject(err);
      }
    });
  })
}

let handleGetStarted = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let username = await getUserName(sender_psid);
      let response1 = { "text": `Welcome ${username} to Greenwich university CT!` };

      //let response2 = getStartedTemplate();

      //send an image
      let response2 = getImageGetStartedTemplate();

      let response3 = getStartedQuickReplyTemplate();
      //send text message
      await callSendAPI(sender_psid, response1);

      //send an image
      await callSendAPI(sender_psid, response2);

      //send a quick reply
      await callSendAPI(sender_psid, response3);

      resolve('done');
    } catch (e) {
      reject(e);
    }
  })
}

let getStartedTemplate = (senderID) => {
  let response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",

        "elements": [{
          "title": "Welcome to the University of Greenwich Vietnam",
          "subtitle": "Here are your options.",
          "image_url": IMAGE_GET_STARTED,
          "buttons": [
            {
              "type": "postback",
              "title": "Information",
              "payload": "MAIN_MENU",
            },
            {
              "type": "web_url",
              "url": `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
              "title": "Registration",
              "webview_height_ratio": "tall",
              "messenger_extensions": true
            },
            {
              "type": "postback",
              "title": "Guide to use bot",
              "payload": "GUIDE_TO_USE",
            }
          ],
        }]
      }
    }
  }
  return response;
}

let getImageGetStartedTemplate = () => {
  let response = {
    "attachment": {
      "type": "image",
      "payload": {
        "url": IMAGE_WELCOME,
        "is_reusable": true
      }
    }
  }
  return response;
}

let getStartedQuickReplyTemplate = () => {
  let response = {
    "text": "Here are your options:",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Information",
        "payload": "MAIN_MENU",
      },
      {
        "content_type": "text",
        "title": "Guide to use bot",
        "payload": "GUIDE_TO_USE",
      },

    ]
  }

  return response;
}

let handleSendMainMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getMainMenuTemplate(sender_psid);
      await callSendAPI(sender_psid, response1);
      resolve('done');

    } catch (e) {
      reject(e);
    }
  })
}

let handleSendMainMenuRegisterOnline = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getMainMenuTemplateRegisterOnline(sender_psid);
      await callSendAPI(sender_psid, response1);
      resolve('done');

    } catch (e) {
      reject(e);
    }
  })
}

let getMainMenuTemplateRegisterOnline = (senderID) => {
  let response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [
          {
            "title": "GREENWICH UNIVERSITY STUDENTS ONLY!",
            "subtitle": "Here are your opBuy LAPTOP at FPT Shop, discount up to 3 million, special offer for students of University of Greenwich.Buy it now: http://bit.ly/FPTShop_Laptoptions.",
            "image_url": IMAGE_MAIN_MENU_3,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
                "title": "Registration",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              },
            ],
          },

          {
            "title": "Application for admission examination",
            "subtitle": "Admission application documents include",
            "image_url": IMAGE_VIEW_DETAILSREGISTER,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_LINKREGISTER}`,
                "title": "Download here",
                "messenger_extensions": false
              },
            ],
          }
        ]
      }
    }
  }
  return response;
}

let handleSendMainMenuScholarship = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getMainMenuTemplateScholarship(sender_psid);
      await callSendAPI(sender_psid, response1);
      resolve('done');

    } catch (e) {
      reject(e);
    }
  })
}

let getMainMenuTemplateScholarship = (senderID) => {
  let response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [
          {
            "title": "Information about scholarship",
            "subtitle": "Greenwich Vietnam spends a scholarship fund worth VND 96 billion.",
            "image_url": IMAGE_MAIN_MENU_4,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_SCHOLARSHIP}`,
                "title": "See Details",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              },
            ],
          },
        ]
      }
    }
  }
  return response;
}

let getMainMenuTemplate = (senderID) => {
  let response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",

        "elements": [
          {
            "title": "Information about Greenwich university",
            "subtitle": "Here is information on how to enroll and information about the school's majors.",
            "image_url": IMAGE_MAIN_MENU_2,
            "buttons": [
              {
                "type": "postback",
                "title": "ADMISSION NOTICE 2023",
                "payload": "RECRUITMENT_INFORMATION",
              },
              {
                "type": "postback",
                "title": "SOLDIERS NEED TO KNOW",
                "payload": "TRAINING_SPECIALISTS",
              },
            ],
          },

          {
            "title": "GREENWICH UNIVERSITY STUDENTS ONLY!",
            "subtitle": "Here are your opBuy LAPTOP at FPT Shop, discount up to 3 million, special offer for students of University of Greenwich.Buy it now: http://bit.ly/FPTShop_Laptoptions.",
            "image_url": IMAGE_MAIN_MENU_3,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
                "title": "Registration",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              },
            ],
          },

          {
            "title": "Information about scholarship",
            "subtitle": "Greenwich Vietnam spends a scholarship fund worth VND 96 billion.",
            "image_url": IMAGE_MAIN_MENU_4,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_SCHOLARSHIP}`,
                "title": "See Details",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              },
            ],
          },

          {
            "title": "University of Greenwich, UK",
            "subtitle": "Over the years, the University of Greenwich has built its position as one of the world's leading educational institutions, in the Top 501 – 600 best universities in the world in 2023 according to THE World University Rankings, Top 101 – 200 universities. The most influential university in the world according to THE Impact Rankings and Top 3 best universities in the UK by students voted by StudentCrowd.",
            "image_url": IMAGE_VIEW_IFM,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_IFM}`,
                "title": "See Details",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              },
            ],
          },
          {
            "title": "Application for admission examination",
            "subtitle": "Admission application documents include",
            "image_url": IMAGE_VIEW_DETAILSREGISTER,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_LINKREGISTER}`,
                "title": "Download here",
                "messenger_extensions": false
              },
            ],
          }
        ]
      }
    }
  }
  return response;
}

let handleSendRecruitMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = await getRecruitMenuTemplate(sender_psid);
      await callSendAPI(sender_psid, response1);
      resolve('done');

    } catch (e) {
      reject(e);
    }
  })
}

let getRecruitMenuTemplate = async (senderID) => {
  //get data from database
  // let data = await db.Product.findAll({
  //   raw: true
  // });
  // let elements = [];
  // if (data && data.length > 0) {


  //   data.map(item => {
  //     elements.push({
  //       "title": item.title,
  //       "subtitle": item.subtitle,
  //       "image_url": item.image_url,
  //       "buttons": [
  //         {
  //           "type": "postback",
  //           "title": "See details",
  //           "payload": item.payload,
  //         },
  //       ],
  //     })
  //   })
  // }
  // elements.push({
  //   "title": "Back to homepage",
  //   "subtitle": "Click on Back Button to return to the homepage.",
  //   "image_url": IMAGE_BACK_MAIN_MENU,
  //   "buttons": [
  //     {
  //       "type": "postback",
  //       "title": "Back",
  //       "payload": "BACK_TO_MAIN_MENU",
  //     },
  //     {
  //       "type": "web_url",
  //       "url": `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
  //       "title": "Registration",
  //       "webview_height_ratio": "tall",
  //       "messenger_extensions": true
  //     }
  //   ],
  // })
  // let response = {
  //   "attachment": {
  //     "type": "template",
  //     "payload": {
  //       "template_type": "generic",

  //       "elements": []
  //     }
  //   }
  // }
  // response.attachment.payload.elements = elements;

  let response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",

        "elements": [
          {
            "title": "Information Technology",
            "subtitle": "Below is detailed information about the information technology industry, a field that is considered to be the hottest right now.",
            "image_url": IMAGE_VIEW_ADMISSION,
            "buttons": [
              {
                "type": "postback",
                "title": "See details",
                "payload": "VIEW_ADMISSION",
              },
            ],
          },

          {
            "title": "Graphic & Digital Design",
            "subtitle": "Students will be equipped with the knowledge and understanding of their relationship as a graphic and digital designer with a wide range of clients, markets, users, consumers, participants, peers and co-creators.",
            "image_url": IMAGE_VIEW_DESIGN,
            "buttons": [
              {
                "type": "postback",
                "title": "See details",
                "payload": "VIEW_TRANSCRIPT",
              },
            ],
          },

          {
            "title": "Business administration",
            "subtitle": "The University of Greenwich's Bachelor of Business Administration program is continuously updated and renewed to meet the ever-changing needs of the global business environment.",
            "image_url": IMAGE_VIEW_TRANSCRIPT_2,
            "buttons": [
              {
                "type": "postback",
                "title": "See details",
                "payload": "VIEW_TRANSCRIPT_2",
              }
            ],
          },

          {
            "title": "Marketing manager",
            "subtitle": "The University of Greenwich was the first UK university to offer a bachelor's degree in marketing communications and has been training in Marketing for over 20 years.",
            "image_url": IMAGE_VIEW_ADMISSION,
            "buttons": [
              {
                "type": "postback",
                "title": "See details",
                "payload": "VIEW_MARKETTING",
              }
            ],
          },

          {
            "title": "Back to homepage",
            "subtitle": "Click on Back Button to return to the homepage.",
            "image_url": IMAGE_BACK_MAIN_MENU,
            "buttons": [
              {
                "type": "postback",
                "title": "Back",
                "payload": "BACK_TO_MAIN_MENU",
              },
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
                "title": "Registration",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              }
            ],
          }
        ]
      }
    }
  }
  return response;
}

let handleSendTrainingMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getTrainingMenuTemplate(sender_psid);
      await callSendAPI(sender_psid, response1);
      resolve('done');

    } catch (e) {
      reject(e);
    }
  })
}

let getTrainingMenuTemplate = (senderID) => {
  let response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",

        "elements": [
          {
            "title": "OJT . Program",
            "subtitle": "OJT (On the job training) is a special program of Greenwich Vietnam with the aim of equipping students with knowledge, skills and practical experience to apply to their future jobs.",
            "image_url": IMAGE_VIEW_ADMISSION,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_OJT}`,
                "title": "See Details",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              }
            ],
          },

          {
            "title": "PDP Program",
            "subtitle": "urrently, Vietnam is ranked 80 out of 93 countries in the Global Talent Competitiveness Index in terms of work skills. Vietnamese students have the ability to learn quite quickly but soft skills are one of the things that most 70% of new graduates lack and need training from employers.",
            "image_url": IMAGE_VIEW_TRANSCRIPT_2,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_PDP}`,
                "title": "See Details",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              }
            ],
          },

          {
            "title": "Frequently asked questions",
            "subtitle": "Frequently asked questions are always updated and answered by the school.",
            "image_url": IMAGE_VIEW_TRANSCRIPT_2,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_QUESTIONS}`,
                "title": "See Details",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              }
            ],
          },

          {
            "title": "Back to homepage",
            "subtitle": "Click on Back Button to return to the homepage.",
            "image_url": IMAGE_BACK_MAIN_MENU,
            "buttons": [
              {
                "type": "postback",
                "title": "Back",
                "payload": "BACK_TO_MAIN_MENU",
              },
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
                "title": "Registration",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              }
            ],
          }
        ]
      }
    }
  }
  return response;
}

let handleBackToMainMenu = async (sender_psid) => {
  await handleSendMainMenu(sender_psid);
}

let handleDetailViewAdmission = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getDetailViewAdmissionTemplate(sender_psid);
      await callSendAPI(sender_psid, response1);
      resolve('done');

    } catch (e) {
      reject(e);
    }
  })
}

let getDetailViewAdmissionTemplate = (senderID) => {
  let response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",

        "elements": [
          {
            "title": "Stages and subjects taught in the information technology industry",
            "subtitle": "In-depth expertise and ability to apply that knowledge in a multinational environment.",
            "image_url": IMAGE_DETAIL_ADMISSION_1,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_IT}`,
                "title": "Curriculum framework",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              },
            ]
          },

          {
            "title": "Total tuition of the information technology industry",
            "subtitle": "Detailed tuition fees are updated every year.",
            "image_url": IMAGE_DETAIL_ADMISSION_2,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_TUITION}`,
                "title": "Tuition Details",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              },
            ]
          },

          {
            "title": "Admission conditions",
            "subtitle": "Greenwich Vietnam recruits directly through the following recruitment methods.",
            "image_url": IMAGE_DETAIL_ADMISSION_1,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_IT_ADMISSIONS}`,
                "title": "Admissions conditions",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              },
            ]
          },

          {
            "title": "Back to homepage",
            "subtitle": "Click on Back Button to return to the homepage.",
            "image_url": IMAGE_BACK_MAIN_MENU,
            "buttons": [
              {
                "type": "postback",
                "title": "Back",
                "payload": "BACK_TO_MAIN_MENU",
              },
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
                "title": "Registration",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              }
            ],
          }
        ]
      }
    }
  }
  return response;
}

let getDetailViewTranscriptTemplate = (senderID) => {
  let response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",

        "elements": [
          {
            "title": "Curriculum framework of Graphic & Digital Design",
            "subtitle": "The primary purpose of the program is to prepare students for exposure to the creative industries and the world of thinking and design through supporting students' continued personal development and professional practice throughout. its working process.",
            "image_url": IMAGE_DETAIL_TRANSCRIPT_1,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_DESIGN}`,
                "title": "Curriculum framework",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              }
            ],
          },

          {
            "title": "Total tuition of the Graphic & Design industry",
            "subtitle": "The primary purpose of the program is to prepare students for exposure to the creative industries and the world of thinking and design through supporting students' continued personal development and professional practice throughout.",
            "image_url": IMAGE_DETAIL_TRANSCRIPT_2,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_TUITION}`,
                "title": "Tuition Details",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              }
            ],
          },
          {
            "title": "Admission conditions",
            "subtitle": "Greenwich Vietnam recruits directly through the following recruitment methods.",
            "image_url": IMAGE_DETAIL_ADMISSION_1,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_IT_ADMISSIONS}`,
                "title": "Admissions conditions",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              },
            ]
          },

          {
            "title": "Back to homepage",
            "subtitle": "Click on Back Button to return to the homepage.",
            "image_url": IMAGE_BACK_MAIN_MENU,
            "buttons": [
              {
                "type": "postback",
                "title": "Back",
                "payload": "BACK_TO_MAIN_MENU",
              },
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
                "title": "Registration",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              }
            ],
          }
        ]
      }
    }
  }
  return response;
}

let getDetailViewTranscript2Template = (senderID) => {
  let response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",

        "elements": [
          {
            "title": "Curriculum framework of Business administration",
            "subtitle": "You are connected, create a network of relationships with companies and employers very early and can receive job opportunities after graduation right during the internship period at the enterprise.",
            "image_url": IMAGE_DETAIL_TRANSCRIPT_2_1,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_BUSINESS}`,
                "title": "Curriculum framework",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              }
            ],
          },

          {
            "title": "Total tuition of the Business",
            "subtitle": "You are equipped with extensive practical knowledge about business models and operations through regular seminars and seminars with businesses from many fields.",
            "image_url": IMAGE_DETAIL_TRANSCRIPT_2,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_TUITION}`,
                "title": "Tuition Details",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              }
            ],
          },
          {
            "title": "Admission conditions",
            "subtitle": "The program helps students develop the most needed and up-to-date skills in management, business leadership, business strategy, business ethics and cross-cultural governance.",
            "image_url": IMAGE_DETAIL_ADMISSION_1,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_IT_ADMISSIONS}`,
                "title": "Admissions conditions",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              },
            ]
          },

          {
            "title": "Back to homepage",
            "subtitle": "Click on Back Button to return to the homepage.",
            "image_url": IMAGE_BACK_MAIN_MENU,
            "buttons": [
              {
                "type": "postback",
                "title": "Back",
                "payload": "BACK_TO_MAIN_MENU",
              },
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
                "title": "Registration",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              }
            ],
          }
        ]
      }
    }
  }
  return response;
}

let getDetailViewMarkettingTemplate = (senderID) => {
  let response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",

        "elements": [
          {
            "title": "Curriculum framework of Marketing manager",
            "subtitle": "Students majoring in Marketing Management will be provided with more knowledge and skills in marketing management in the current digital age.",
            "image_url": IMAGE_DETAIL_TRANSCRIPT_2_1,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_MARKETTING}`,
                "title": "Curriculum framework",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              }
            ],
          },

          {
            "title": "Total tuition of the Marketing manager",
            "subtitle": "The University of Greenwich was the first UK university to offer a bachelor's degree in marketing communications and has been training in Marketing for over 20 years.",
            "image_url": IMAGE_DETAIL_TRANSCRIPT_2,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_TUITION}`,
                "title": "Tuition Details",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              }
            ],
          },
          {
            "title": "Admission conditions",
            "subtitle": "Expanding on the basis of the subjects of Business Administration.",
            "image_url": IMAGE_DETAIL_ADMISSION_1,
            "buttons": [
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_IT_ADMISSIONS}`,
                "title": "Admissions conditions",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              },
            ]
          },

          {
            "title": "Back to homepage",
            "subtitle": "Click on Back Button to return to the homepage.",
            "image_url": IMAGE_BACK_MAIN_MENU,
            "buttons": [
              {
                "type": "postback",
                "title": "Back",
                "payload": "BACK_TO_MAIN_MENU",
              },
              {
                "type": "web_url",
                "url": `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
                "title": "Registration",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
              }
            ],
          }
        ]
      }
    }
  }
  return response;
}

let handleDetailViewTranscript = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getDetailViewTranscriptTemplate(sender_psid);
      await callSendAPI(sender_psid, response1);
      resolve('done');
    } catch (e) {
      reject(e);
    }
  })
}

let handleDetailViewTranscript2 = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getDetailViewTranscript2Template(sender_psid);
      await callSendAPI(sender_psid, response1);
      resolve('done');
    } catch (e) {
      reject(e);
    }
  })
}

let handleDetailViewMarketting = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getDetailViewMarkettingTemplate(sender_psid);
      await callSendAPI(sender_psid, response1);
      resolve('done');
    } catch (e) {
      reject(e);
    }
  })
}
let getImageScholarshipTemplate = () => {
  let response = {
    "attachment": {
      "type": "image",
      "payload": {
        "url": IMAGE_DETAIL_SCHOLARSHIP,
        "is_reusable": true
      }
    }
  }
  return response;
}


// let getButtonScholarshipTemplate = (senderID) => {
//   let response = {
//     "attachment": {
//       "type": "template",
//       "payload": {
//         "template_type": "generic",
//         "text": "Below are the scholarships and the eligibility criteria for each regional scholarship.",
//         "buttons": [
//           {
//             "type": "postback",
//             "title": "Back to main menu",
//             "payload": "MAIN_MENU",
//           },
//           {
//             "type": "web_url",
//             "url": `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
//             "title": "Registration",
//             "webview_height_ratio": "tall",
//             "messenger_extensions": true
//           }
//         ]
//       }
//     }
//   }
//   return response;
// }
let handleshowDetailScholarship = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      //send an image
      let response1 = getImageScholarshipTemplate(sender_psid);
      //send a button templates : text, buttons
      let response2 = getButtonScholarshipTemplate(sender_psid);
      await callSendAPI(sender_psid, response1);
      await callSendAPI(sender_psid, response2);
      resolve('done');
    } catch (e) {
      reject(e);
    }
  })
}

let handleGuideToUseBot = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      //send text message
      let username = await getUserName(sender_psid);
      let response1 = { "text": `Welcome ${username} to Greenwich university CT! \n For more detailed information on how to use bots please watch the video below!` };
      //send a button templates : text, buttons
      let response2 = getBotMediaTemplate();

      await callSendAPI(sender_psid, response1);
      await callSendAPI(sender_psid, response2);
      resolve('done');
    } catch (e) {
      reject(e);
    }
  })
}

let getBotMediaTemplate = () => {
  let response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "media",
        "elements": [
          {
            "media_type": "video",
            //"attachment_id": "1855594094804584",
            "url": "https://www.facebook.com/100067331252650/videos/1855594094804584/",
            "buttons": [
              {
                "type": "postback",
                "title": "Information",
                "payload": "MAIN_MENU",
              },
              {
                "type": "postback",
                "title": "Start",
                "payload": "RESTART_BOT",
              },
            ]
          }
        ]
      }
    }
  };

  return response;
}
let setupPersistentMenuService = () => {
  return new Promise(((resolve, reject) => {
    let uri = `https://graph.facebook.com/v9.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`;
    let request_body = {
      "get_started": {
        "payload": "GET_STARTED"
      },
      "persistent_menu": [
        {
          "locale": "default",
          "composer_input_disabled": false,
          "call_to_actions": [
            {
              "type": "postback",
              "title": "Talk to an agent",
              "payload": "CARE_HELP"
            },
            {
              "type": "postback",
              "title": "Guide to use bot",
              "payload": "GUIDE_TO_USE",
            },
            {
              "type": "postback",
              "title": "Restart this conversation",
              "payload": "RESTART_BOT"
            }
          ]
        }
      ]
    };

    request({
      "uri": uri,
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      console.log(body);
      if (!err) {
        resolve("done");
      } else {
        reject("Unable to send message:" + err);
      }
    });
  }));
};

let passTheadControl = (sender_psid) => {
  return new Promise((resolve, reject) => {
    let request_body = {
      "recipient": {
        "id": sender_psid
      },
      "target_app_id": PAGE_INBOX_ID,
      "metadata": "Pass this conversation to the page inbox"
    };

    request({
      "uri": `https://graph.facebook.com/v6.0/me/pass_thread_control?access_token=${PAGE_ACCESS_TOKEN}`,
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      if (!err) {
        resolve("done")
      } else {
        reject("Unable to send message:" + err);

      }
    });
  });
};

let takeControlConversation = (sender_psid) => {
  return new Promise((resolve, reject) => {
    let request_body = {
      "recipient": {
        "id": sender_psid
      },

      "metadata": "Pass this conversation to the user, turn on the bot"
    };

    request({
      "uri": `https://graph.facebook.com/v6.0/me/take_thread_control?access_token=${PAGE_ACCESS_TOKEN}`,
      "method": "POST",
      "json": request_body
    }, async (err, res, body) => {
      if (!err) {
        let response = {
          "text": "The super bot came back !!!"
        };
        await sendMessage(response, sender_psid);
        resolve("done")
      } else {
        reject("Unable to send message:" + err);

      }
    });
  });
};

let sendMessage = (response, sender_psid, message) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Construct the message body
      let request_body = {
        "recipient": {
          "id": sender_psid
        },
        "message": response
      }

      await sendMarkReadMessage(sender_psid);
      await sendTypingOn(sender_psid);

      // Send the HTTP request to the Messenger Platform
      request({
        "uri": "https://graph.facebook.com/v9.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
      }, (err, res, body) => {
        console.log("----------------")
        console.log(body)
        console.log("----------------")
        if (!err) {
          resolve('message sent!')
        } else {
          reject("Unable to send message:" + err);
        }
      });

    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  handleGetStarted: handleGetStarted,
  handleSendMainMenu: handleSendMainMenu,
  handleSendRecruitMenu: handleSendRecruitMenu,
  handleSendTrainingMenu: handleSendTrainingMenu,
  handleBackToMainMenu: handleBackToMainMenu,
  handleDetailViewAdmission: handleDetailViewAdmission,
  handleDetailViewTranscript: handleDetailViewTranscript,
  handleDetailViewTranscript2: handleDetailViewTranscript2,
  handleshowDetailScholarship: handleshowDetailScholarship,
  callSendAPI: callSendAPI,
  getUserName: getUserName,
  handleGuideToUseBot: handleGuideToUseBot,
  getRecruitMenuTemplate: getRecruitMenuTemplate,
  handleDetailViewMarketting: handleDetailViewMarketting,
  setupPersistentMenuService: setupPersistentMenuService,
  passTheadControl: passTheadControl,
  takeControlConversation: takeControlConversation,
  handleSendMainMenuScholarship: handleSendMainMenuScholarship,
  handleSendMainMenuRegisterOnline: handleSendMainMenuRegisterOnline,
  // handleUserInput: handleUserInput,
  // getMatchingKeyword: getMatchingKeyword,
}