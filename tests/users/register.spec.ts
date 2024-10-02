import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

describe("POST /auth/register", () => {
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
    describe("Given all fields", () => {
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

        it("should store the hashed password in the database", async () => {
            const userData = {
                firstName: "Ritik",
                lastName: "Mewada",
                email: "ritik@mern.space",
                password: "secret",
            };

            await request(app).post("/auth/register").send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users[0].password).not.toEqual(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        });

        it("should return 400 status code if email is already exists", async () => {
            const userData = {
                firstName: "Ritik",
                lastName: "Mewada",
                email: "ritik@mern.space",
                password: "secret",
                role: Roles.CUSTOMER,
            };

            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            const users = await userRepository.find();

            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });
    });

    describe("Fields are missing", () => {
        it("should return 400 status code if email field is missing", async () => {
            const userData = {
                firstName: "Ritik",
                lastName: "Mewada",
                email: "",
                password: "secret",
                role: Roles.CUSTOMER,
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        });
    });

    describe("Fields are not in proper format", () => {
        it("should trim the email field", async () => {
            const userData = {
                firstName: "Ritik",
                lastName: "Mewada",
                email: "    ritik@mern.space      ",
                password: "secret",
            };

            await request(app).post("/auth/register").send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            const user = users[0];

            expect(user.email).toBe("ritik@mern.space");
        });
    });
});
