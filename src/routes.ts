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
router.get("/users", userController.show)
router.post("/users", userController.create);
router.patch("/users", userController.edit);
router.delete("/users/:id", userController.delete);

// Surveys Routes
router.get("/surveys", surveyController.show);
router.post("/surveys", surveyController.create);
router.patch("/surveys", surveyController.edit);
router.delete("/surveys/:id", surveyController.delete);

// Answers routes
router.get("/all-answers/", answerController.show);
router.get("/answers/:value", answerController.execute);
router.delete("/answers/:id", answerController.delete);

// Emails routes
router.post("/sendEmail", sendEmailController.execute);

// NPS routes
router.get("/nps/:survey_id", npsController.execute);

export { router };