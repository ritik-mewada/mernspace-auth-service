import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import {
    CreateUserRequest,
    UpdateUserRequest,
    UserQueryParams,
} from "../types";
import { Logger } from "winston";
import { Roles } from "../constants";
import { matchedData, validationResult } from "express-validator";
import createHttpError from "http-errors";

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
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

    async getAll(req: Request, res: Response, next: NextFunction) {
        const validatedQuery = matchedData(req, { onlyValidData: true });

        try {
            const [users, count] = await this.userService.getAll(
                validatedQuery as UserQueryParams,
            );

            this.logger.info("All users have been fetched");

            res.json({
                currentPage: validatedQuery.currentPage as number,
                perPage: validatedQuery.perPage as number,
                total: count,
                data: users,
            });
        } catch (err) {
            next(err);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid user param"));
            return;
        }

        try {
            const user = await this.userService.findById(Number(userId));

            if (!user) {
                next(createHttpError(400, "User does not exist"));
                return;
            }
            this.logger.info("User has been fetched", { id: user.id });
            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async update(req: UpdateUserRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, role, email, tenantId } = req.body;
        const userId = req.params.id;

        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid url param."));
            return;
        }

        this.logger.debug("Request for updating a user", req.body);

        try {
            await this.userService.update(Number(userId), {
                firstName,
                lastName,
                role,
                email,
                tenantId,
            });

            this.logger.info("User has been updated", { id: userId });

            res.json({ id: Number(userId) });
        } catch (err) {
            next(err);
        }
    }
}
