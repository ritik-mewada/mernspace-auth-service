import createJWKSMoke from "mock-jwks";
import request from "supertest";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";
import { Tenant } from "../../src/entity/Tenant";
import { Roles } from "../../src/constants";

describe("POST /tenants", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMoke>;

    let adminToken: string;

    beforeAll(async () => {
        jwks = createJWKSMoke("http://localhost:5501");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();

        adminToken = jwks.token({
            sub: "1",
            role: Roles.ADMIN,
        });
    });

    afterAll(async () => {
        await connection.destroy();
    });
    afterEach(() => {
        jwks.stop();
    });

    describe("Given all fields.", () => {
        it("should return a 201 status code", async () => {
            const tenantData = {
                name: "Tenant Name",
                address: "Tenant Address",
            };

            const response = await request(app)
                .post("/tenants")
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(tenantData);

            expect(response.statusCode).toBe(201);
        });

        it("should create a tenant in the database", async () => {
            const tenantData = {
                name: "Tenant Name",
                address: "Tenant Address",
            };

            await request(app)
                .post("/tenants")
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(tenantData);

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();

            expect(tenants).toHaveLength(1);
            expect(tenants[0].name).toBe(tenantData.name);
            expect(tenants[0].address).toBe(tenantData.address);
        });

        it("should return 401 if user is not authenticated", async () => {
            const tenantData = {
                name: "Tenant Name",
                address: "Tenant Address",
            };

            const response = await request(app)
                .post("/tenants")
                .send(tenantData);

            expect(response.statusCode).toBe(401);

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();

            expect(tenants).toHaveLength(0);
        });

        it("should return 403 if user is not an admin", async () => {
            const managerToken = jwks.token({
                sub: "1",
                role: Roles.MANAGER,
            });

            const tenantData = {
                name: "Tenant Name",
                address: "Tenant Address",
            };

            const response = await request(app)
                .post("/tenants")
                .set("Cookie", [`accessToken=${managerToken}`])
                .send(tenantData);

            expect(response.statusCode).toBe(403);

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();

            expect(tenants).toHaveLength(0);
        });
    });
});
