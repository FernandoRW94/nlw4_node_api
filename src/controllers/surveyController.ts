import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/SurveysRepository";
import * as yup from "yup";

class SurveyController {
    async create(request: Request, response: Response) {
        const {title, description} = request.body;

        const schema = yup.object().shape({
            title: yup.string().required("Title is required."),
            description: yup.string().required("Description is required.")
        });

        try {
            await schema.validate(request.body, {
                abortEarly: false
            });
        } catch(error) {
            throw new AppError("Bad request", 400, error);
        }

        const surveysRepository = getCustomRepository(SurveysRepository);

        const survey = surveysRepository.create({title, description});

        await surveysRepository.save(survey);

        return response.status(201).json(survey);
    }

    async edit(request: Request, response: Response) {
        const {title, description, id} = request.body;

        const schema = yup.object().shape({
            id: yup.string().required("ID is required"),
            title: yup.string().required("Title is required."),
            description: yup.string().required("Description is required.")
        });

        try {
            await schema.validate(request.body, {
                abortEarly: false
            });
        } catch(error) {
            throw new AppError("Bad request", 400, error);
        }

        const surveysRepository = getCustomRepository(SurveysRepository);

        let survey = await surveysRepository.findOne({id});

        if(!survey) {
            throw new AppError("Bad request", 400);
        }

        survey.title = title;
        survey.description = description;

        await surveysRepository.save(survey);

        return response.status(200).json(survey);
    }

    async show(request: Request, response: Response) {
        const surveysRepository = getCustomRepository(SurveysRepository);
        const all = await surveysRepository.find();

        return response.json(all);
    }

    async delete(request: Request, response: Response) {
        const surveysRepository = getCustomRepository(SurveysRepository);

        if(!request.params.id) {
            throw new AppError("Bad request", 400);
        }

        await surveysRepository.delete({id: request.params.id});
        
        return response.status(200).json({message: "Survey was successfully deleted!"});
    }
}

export { SurveyController };