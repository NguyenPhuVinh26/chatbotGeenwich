import express from "express";
import chatbotController from "../controllers/chatbotController";
let router = express.Router();

let initwebRoutes = (app) => {
    router.get("/", chatbotController.getHomePage);
    // setup get started button, whitelisted domain
    router.post('/setup-profile', chatbotController.setupProfile);
    //setup persistent menu
    router.post('/persistent-menu', chatbotController.setupPersistentMenu);

    router.get("/webhook", chatbotController.getWebhook);
    router.post("/webhook", chatbotController.postWebhook);

    router.get('/reserve-register-online/:senderId', chatbotController.handleRerserveRegister);
    router.post('/reserve-register-online-ajax', chatbotController.handlePostReserveRegister);


    router.get('/view-it', chatbotController.handleViewIT);
    router.get('/view-tuition', chatbotController.handleViewTuition);
    router.get('/view-it-admissions', chatbotController.handleViewItAdmissions);
    router.get('/view-design', chatbotController.handleViewDesign);
    router.get('/view-business', chatbotController.handleViewBusiness);
    router.get('/view-marketting', chatbotController.handleViewMarketting);
    router.get('/view-scholarship', chatbotController.handleViewScholarship);
    router.get('/view-ojt', chatbotController.handleViewOJT);
    router.get('/view-pdp', chatbotController.handleViewPDP);
    router.get('/view-question', chatbotController.handleViewQuestion);
    router.get('/view-information', chatbotController.handleViewInformation);
    
    return app.use("/", router);
};

module.exports = initwebRoutes;