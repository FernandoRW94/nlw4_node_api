import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import { SurveysRepository } from "../repositories/SurveysRepository";
import SendEmailService from "../services/SendEmailService";

import {resolve} from "path";

class SendEmailController {
    async execute(request: Request, response: Response) {
        const {email, survey_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({email});
        if(!user) {
            return response.status(400).json({message: "User does not exist."});
        }

        const survey = await surveysRepository.findOne({id: survey_id});
        if(!survey) {
            return response.status(400).json({message: "Survey does not exist."});
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
        const emailVariables = {
            user_id: user.id,
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
            console.log("answered survey requested");
            return response.status(400).json({message: "Survey already answered!"});
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
            console.log("unanswered survey requested");
            await SendEmailService.execute("NPS <noreply@nps.com.br>", user.email, survey.title, npsPath, emailVariables);
            return response.status(200).json(existingUnansweredSurvey);
        }

        const newSurvey = await surveysUsersRepository.create({
            user_id: user.id,
            survey_id: survey.id
        });
        await surveysUsersRepository.save(newSurvey);

        console.log("new survey requested");
        await SendEmailService.execute("NPS <noreply@nps.com.br>", user.email, survey.title, npsPath, emailVariables);
        return response.status(201).json(newSurvey);
    }
}

export { SendEmailController }