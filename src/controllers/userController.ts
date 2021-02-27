import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import * as yup from "yup";
import { AppError } from "../errors/AppError";

class UserController {
    async create(req: Request, res: Response) {
        const { name, email} = req.body;

        const schema = yup.object().shape({
            name: yup.string().required("Name is required."),
            email: yup.string().email("Invalid email.").required("Email is required.")
        });

        // Option 1
        // if(!(await schema.isValid(req.body))){
        //     return res.status(400).json({error: "Validation Failed!"});
        // }

        // Option 2
        try{
            await schema.validate(req.body, {
                abortEarly: false // Displays all validation errors at once.
            });
        }catch(error) {
            throw new AppError("Bad request", 400, error);
            return res.status(400).json({error});
        }

        const usersRepository = getCustomRepository(UsersRepository);

        // select * from users where email = $email
        const userAlreadyExists = await usersRepository.findOne({
            email
        });

        if(userAlreadyExists) {
            return res.status(400).json({
                error: "User already exists."
            });
        }

        const user = usersRepository.create({
            name,
            email
        });

        await usersRepository.save(user);

        return res.status(201).json(user);
    }

    async edit(req: Request, res: Response) {
        const { name, id } = req.body;

        const schema = yup.object().shape({
            name: yup.string().required("Name is required."),
            id: yup.string().required("Id is required.")
        });

        try{
            await schema.validate(req.body, {
                abortEarly: false // Displays all validation errors at once.
            });
        }catch(error) {
            throw new AppError("Bad request", 400, error);
        }

        const usersRepository = getCustomRepository(UsersRepository);

        let user = await usersRepository.findOne({id});

        if(!user) {
            throw new AppError("Bad request", 400);
        }

        user.name = name;

        await usersRepository.save(user);

        return res.json(user);
    }

    async delete(req: Request, res: Response) {
        const usersRepository = getCustomRepository(UsersRepository);

        if(!req.params.id) {
            throw new AppError("Bad request", 400);
        }

        await usersRepository.delete({id: req.params.id});

        return res.status(200).json({message: "User successfully deleted!"});
    }

    async show(req: Request, res: Response) {
        const usersRepository = getCustomRepository(UsersRepository);
        const all = await usersRepository.find();

        return res.json(all);
    }
}

export { UserController };
