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
import listTenantValidator from "../validators/list-tenant-validator";

const router = express.Router();
const tenantRepository = AppDataSource.getRepository(Tenant);
const tenanatService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenanatService, logger);

router.post(
    "/",
    tenantValidator,
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.create(req, res, next) as unknown as RequestHandler,
);

router.get(
    "/",
    listTenantValidator,
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.getAll(req, res, next) as unknown as RequestHandler,
);

router.get(
    "/:id",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.getOne(req, res, next) as unknown as RequestHandler,
);

router.patch(
    "/:id",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.update(req, res, next) as unknown as RequestHandler,
);

router.delete(
    "/:id",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) =>
        tenantController.destroy(req, res, next) as unknown as RequestHandler,
);

export default router;
