import { Config } from ".";
import { Roles } from "../constants";
import { UserService } from "../services/UserService";
import logger from "./logger";

export const createDefaultAdmin = async (userService: UserService) => {
    try {
        const existingAdmin = await userService.findByEmailWithPassword(
            Config.ADMIN_EMAIL!,
        );
        if (!existingAdmin) {
            logger.info("Creating default admin user...");
            await userService.create({
                firstName: "Admin",
                lastName: "User",
                email: Config.ADMIN_EMAIL!,
                password: Config.ADMIN_PASSWORD!,
                role: Roles.ADMIN,
            });
            logger.info("Default admin user created successfully!");
        } else {
            logger.info("Default admin user already exists.");
        }
    } catch (error) {
        logger.error("Error creating default admin user:", error);
    }
};
