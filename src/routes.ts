import { Router } from "express";
import { AnswerController } from "./controllers/answerController";
import { NPSController } from "./controllers/npsController";
import { SendEmailController } from "./controllers/sendEmailController";
import { SurveyController } from "./controllers/surveyController";
import { UserController } from "./controllers/userController";

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendEmailController = new SendEmailController();
const answerController = new AnswerController();
const npsController = new NPSController();

// Users Routes
router.post("/users", userController.create);

// Surveys Routes
router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);
router.delete("/surveys/:id", surveyController.delete);

// Emails routes
router.post("/sendEmail", sendEmailController.execute);

// Answers routes
router.get("/answers/:value", answerController.execute);

// NPS routes
router.get("/nps/:survey_id", npsController.execute);

export { router };