import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {
    async execute(request: Request, response: Response) {
        const { value } = request.params;
        const { u } = request.query;

        const valueNumber = Number(value);

        if(isNaN(valueNumber) && valueNumber > 10 || valueNumber < 0){
            throw new AppError("Bad Request", 400);
        }

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        });

        if(!surveyUser) {
            throw new AppError("Bad Request", 400);
        }

        surveyUser.value = Number(value);

        await surveysUsersRepository.save(surveyUser);

        return response.json(surveyUser);
    }

    async delete(request: Request, response: Response) {
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        if(!request.params.id) {
            throw new AppError("Bad request", 400);
        }

        await surveysUsersRepository.delete({id: request.params.id});

        return response.status(200).json({message: "SurveyUser was successfully deleted!"});
    }

    async show(request: Request, response: Response) {
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
        const surveys = await surveysUsersRepository.find();

        return response.json(surveys);
    }
}

export {AnswerController};