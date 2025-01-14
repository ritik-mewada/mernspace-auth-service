import { NextFunction, Response } from "express";
import { UserService } from "../services/UserService";
import { CreateUserRequest } from "../types";
import { Logger } from "winston";
import { Roles } from "../constants";

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password } = req.body;

        this.logger.info("Retrived all data", req.body.firstName);
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role: Roles.MANAGER,
            });
            this.logger.info("user created");
            res.status(201).json({ id: user.id });
        } catch (err) {
            this.logger.error(err);
            next(err);
        }
    }
}
