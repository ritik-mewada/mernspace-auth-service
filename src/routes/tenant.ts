import express, { NextFunction, Request, Response } from "express";
import { TenantController } from "../controllers/TenantController";
import { TenantService } from "../services/TenantService";
import { Tenant } from "../entity/Tenant";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import authenticate from "../middlewares/authenticate";

const router = express.Router();
const tenantRepository = AppDataSource.getRepository(Tenant);
const tenanatService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenanatService, logger);

router.post(
    "/",
    authenticate,
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.create(req, res, next),
);

export default router;
