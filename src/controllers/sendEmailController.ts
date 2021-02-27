import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import { SurveysRepository } from "../repositories/SurveysRepository";
import SendEmailService from "../services/SendEmailService";

import {resolve} from "path";
import { AppError } from "../errors/AppError";

class SendEmailController {
    async execute(request: Request, response: Response) {
        const {email, survey_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({email});
        if(!user) {
            throw new AppError("User does not exist.", 400);
        }

        const survey = await surveysRepository.findOne({id: survey_id});
        if(!survey) {
            throw new AppError("Survey does not exist.", 400);
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
        const emailVariables = {
            id: "",
            name: user.name,
            title: survey.title,
            description: survey.description,
            link: `${process.env.SITE_URL}answers`
        }

        const existingAnsweredSurvey = await surveysUsersRepository.findOne({
            where: {
                user_id: user.id,
                survey_id: survey.id,
                value: Not(IsNull())
            },
            relations: ["user", "survey"] // just for demonstration
        });

        if(existingAnsweredSurvey) {
            throw new AppError("Survey already answered!", 400);
        }

        const existingUnansweredSurvey = await surveysUsersRepository.findOne({
            where: {
                user_id: user.id,
                survey_id: survey.id,
                value: IsNull()
            },
            relations: ["user", "survey"] // just for demonstration
        });

        if(existingUnansweredSurvey) {
            emailVariables.id = existingUnansweredSurvey.id;
            await SendEmailService.execute("NPS <noreply@nps.com.br>", user.email, survey.title, npsPath, emailVariables);
            return response.status(200).json(existingUnansweredSurvey);
        }

        const newSurvey = await surveysUsersRepository.create({
            user_id: user.id,
            survey_id: survey.id
        });
        await surveysUsersRepository.save(newSurvey);

        emailVariables.id = newSurvey.id;
        await SendEmailService.execute("NPS <noreply@nps.com.br>", user.email, survey.title, npsPath, emailVariables);
        return response.status(201).json(newSurvey);
    }
}

export { SendEmailController }