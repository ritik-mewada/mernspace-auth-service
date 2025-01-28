import app from "./app";
import { Config } from "./config";
import { AppDataSource } from "./config/data-source";
import logger from "./config/logger";
import { Roles } from "./constants";
import { User } from "./entity/User";
import { UserService } from "./services/UserService";

const createDefaultAdmin = async () => {
    const userRepository = AppDataSource.getRepository(User);
    const userService = new UserService(userRepository);

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

const startServer = async () => {
    const PORT = Config.PORT;
    try {
        await AppDataSource.initialize();
        logger.info("Database connected successfully.");

        await createDefaultAdmin();

        app.listen(PORT, () => logger.info(`listening on PORT ${PORT}`));
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(err.message);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

void startServer();

// docker run --rm -it -v $(pwd):/usr/src/app -v /usr/src/app/node_modules --env-file $(pwd)/.env -p 5501:5501 -e NODE_ENV=development auth-service:dev

// FOR POSTGRES CONTAINER
// docker run --rm --name mernpg-container -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v mernpgdata:/var/lib/postgres/data -p 5432:5432 -d postgres

// FOR MIGRATION
// npm run migration:generate -- src/migration/rename_tables -d src/config/data-source.ts
