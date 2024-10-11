import createJWKSMoke from "mock-jwks";
import request from "supertest";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";
import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";

describe("GET /auth/self", () => {
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
        it("should return the 200 status code", async () => {
            const accessToken = jwks.token({
                sub: "1",
                role: Roles.CUSTOMER,
            });

            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", `accessToken=${accessToken}`)
                .send();

            expect(response.statusCode).toBe(200);
        });

        it("should return the user data", async () => {
            const userData = {
                firstName: "Ritik",
                lastName: "Mewada",
                email: "ritik@mern.space",
                password: "password",
                role: Roles.CUSTOMER,
            };

            const userRepository = connection.getRepository(User);
            const data = await userRepository.save(userData);

            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            });

            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", `accessToken=${accessToken}`)
                .send();

            expect((response.body as Record<string, string>).id).toBe(data.id);
        });
    });
});
