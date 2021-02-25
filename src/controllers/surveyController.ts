import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";

class SurveyController {
    async create(request: Request, response: Response) {
        const {title, description} = request.body;
        const surveysRepository = getCustomRepository(SurveysRepository);

        const survey = surveysRepository.create({title, description});

        await surveysRepository.save(survey);

        return response.status(201).json(survey);
    }

    async show(request: Request, response: Response) {
        const surveysRepository = getCustomRepository(SurveysRepository);
        const all = await surveysRepository.find();

        return response.json(all);
    }

    async delete(request: Request, response: Response) {
        const surveysRepository = getCustomRepository(SurveysRepository);

        if(!request.params.id) {
            return response.status(400).json({message: "Bad request"});
        }

        await surveysRepository.delete({id: request.params.id});
        
        return response.status(200).json({message: "Survey was successfully deleted!"});
    }
}

export { SurveyController };