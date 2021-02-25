import { Router } from "express";
import { SendEmailController } from "./controllers/sendEmailController";
import { SurveyController } from "./controllers/surveyController";
import { UserController } from "./controllers/userController";

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendEmailController = new SendEmailController();

// Users Routes
router.post("/users", userController.create);

// Surveys Routes
router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);
router.delete("/surveys/:id", surveyController.delete);

// Emails routes
router.post("/sendEmail", sendEmailController.execute);

export { router };