import app from "./app";
import { Config } from "./config";
import { AppDataSource } from "./config/data-source";
import logger from "./config/logger";

const startServer = async () => {
    const PORT = Config.PORT;
    try {
        await AppDataSource.initialize();
        logger.info("Database connected successfully.");

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

/*
* To create a auth-service image inside docker
- docker run --rm -it -v $(pwd):/usr/src/app -v /usr/src/app/node_modules --env-file $(pwd)/.env -p 5501:5501 -e NODE_ENV=development auth-service:dev

* While setting up auth-service for first time
1. Setup postgres in Docker
    - Install Docker in the system
    - pull the PostgreSql docker image `docker pull postgres'
    - create persistent volume `docker volume create mernpgdata`
    - Run the PostgreSQL container with the volume attached
        - docker run --rm --name mernpg-container -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v mernpgdata:/var/lib/postgres/data -p 5432:5432 -d postgres
    - access Postgres with DBGate app

* FOR MIGRATION
- npm run migration:generate -- src/migration/rename_tables -d src/config/data-source.ts

* FOR INITIAL MIGRATION WHEN SETTING UP AUTH SERVICE FOR THE FIRST TIME
- npm run migration:run -d src/config/data-source.ts
*/
