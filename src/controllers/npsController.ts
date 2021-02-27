import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

/**
 * Detractors => 0 - 6
 * Passives => 7 - 8
 * Promoters => 9 - 10
 * 
 * ((PromotersCount - DetractorsCount) / totalAnswersCount) * 100
 */

class NPSController {
    async execute(request: Request, response: Response) {
        const { survey_id } = request.params;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        });
        
        const detractors = surveysUsers.filter(survey => survey.value <= 6).length;
        const promoters = surveysUsers.filter(survey => survey.value >= 9).length;
        const passives = surveysUsers.filter(survey => survey.value >= 7 && survey.value <= 8).length;
        const totalVotes = detractors + promoters + passives;

        const nps = Number((((promoters - detractors) / totalVotes) * 100).toFixed(2));

        return response.json({nps, detractors, promoters, passives, totalVotes});
    }
}

export {NPSController};