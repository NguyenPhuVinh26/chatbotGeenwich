import express from "express";
import viewEngine from "./config/viewEngine";
import initwebRoute from "./routes/web";
import bodyParser from "body-parser";
import chatbotService from './services/chatbotService';

require("dotenv").config();

let app = express();


viewEngine(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initwebRoute(app);

let port = process.env.PORT || 8080;


chatbotService.getRecruitMenuTemplate();

app.listen(port, () => {
    console.log("Chatbot running in port: " + port);
});
