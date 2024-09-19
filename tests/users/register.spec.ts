import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
    describe("Given all fields", () => {
        it("should return the 200 status code", async () => {
            const userData = {
                firstName: "Ritik",
                LastName: "Mewada",
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
                LastName: "Mewada",
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
                LastName: "Mewada",
                email: "ritik@mern.space",
                password: "secret",
            };

            await request(app).post("/auth/register").send(userData);
        });
    });

    describe("Fields are missing", () => {});
});
