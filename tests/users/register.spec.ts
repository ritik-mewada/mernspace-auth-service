import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

describe("POST /auth/register", () => {
    describe("Given all fields", () => {
        let connection: DataSource;

        beforeAll(async () => {
            connection = await AppDataSource.initialize();
        });
        beforeEach(async () => {
            await connection.dropDatabase();
            await connection.synchronize();
        });
        afterAll(async () => {
            await connection.destroy();
        });

        it("should return the 200 status code", async () => {
            const userData = {
                firstName: "Ritik",
                lastName: "Mewada",
                email: "ritik@mern.space",
                password: "secret",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            expect(response.statusCode).toBe(201);
        });

        it("should return valid json response", async () => {
            const userData = {
                firstName: "Ritik",
                lastName: "Mewada",
                email: "ritik@mern.space",
                password: "secret",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            expect(
                (response.headers as Record<string, string>)["content-type"],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should persit the user in the database", async () => {
            const userData = {
                firstName: "Ritik",
                lastName: "Mewada",
                email: "ritik@mern.space",
                password: "secret",
            };

            await request(app).post("/auth/register").send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
        });

        it("should return an id of the created user", async () => {
            const userData = {
                firstName: "Ritik",
                lastName: "Mewada",
                email: "ritik@mern.space",
                password: "secret",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            expect(response.body).toHaveProperty("id");

            const repository = connection.getRepository(User);
            const users = await repository.find();

            expect((response.body as Record<string, string>).id).toBe(
                users[0].id,
            );
        });

        it("should assign a customer role", async () => {
            const userData = {
                firstName: "Ritik",
                lastName: "Mewada",
                email: "ritik@mern.space",
                password: "secret",
            };

            await request(app).post("/auth/register").send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users[0]).toHaveProperty("role");
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });
    });

    describe("Fields are missing", () => {});
});
