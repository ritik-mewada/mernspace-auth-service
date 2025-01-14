import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import { TenantController } from "../controllers/TenantController";
import { TenantService } from "../services/TenantService";
import { Tenant } from "../entity/Tenant";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../constants";
import tenantValidator from "../validators/tenant-validator";
import listUsersValidator from "../validators/list-users-validator";

const router = express.Router();
const tenantRepository = AppDataSource.getRepository(Tenant);
const tenanatService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenanatService, logger);

router.post(
    "/",
    tenantValidator,
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.create(req, res, next),
);

router.get(
    "/",
    listUsersValidator,
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.getAll(req, res, next),
);

router.get(
    "/:id",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.getOne(req, res, next),
);

router.patch(
    "/:id",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.update(req, res, next),
);

router.delete(
    "/:id",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) => tenantController.destroy(req, res, next),
);

export default router;
