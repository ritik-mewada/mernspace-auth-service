import createJWKSMoke from "mock-jwks";
import request from "supertest";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";
import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";
import { createTenant } from "../utils";
import { Tenant } from "../../src/entity/Tenant";

describe("POST /users", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMoke>;

    beforeAll(async () => {
        jwks = createJWKSMoke("http://localhost:5501");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    afterEach(() => {
        jwks.stop();
    });

    describe("Given all fields.", () => {
        it("should persist the user in the database", async () => {
            const tenant = await createTenant(connection.getRepository(Tenant));

            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            const userData = {
                firstName: "Ritik",
                lastName: "Mewada",
                email: "ritik@mern.space",
                password: "password",
                tenantId: tenant.id,
            };

            await request(app)
                .post("/users")
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(1);
            expect(users[0].email).toBe(userData.email);
        });
    });

    it("should create a manager user", async () => {
        const tenant = await createTenant(connection.getRepository(Tenant));

        const adminToken = jwks.token({
            sub: "1",
            role: Roles.ADMIN,
        });

        const userData = {
            firstName: "Ritik",
            lastName: "Mewada",
            email: "ritik@mern.space",
            password: "password",
            tenantId: tenant.id,
            role: Roles.MANAGER,
        };

        await request(app)
            .post("/users")
            .set("Cookie", [`accessToken=${adminToken}`])
            .send(userData);

        const userRepository = connection.getRepository(User);
        const users = await userRepository.find();

        expect(users).toHaveLength(1);
        expect(users[0].role).toBe(Roles.MANAGER);
    });
});
