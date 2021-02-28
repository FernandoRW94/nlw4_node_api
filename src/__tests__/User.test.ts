import request from "supertest";
import { getConnection } from "typeorm";
import { app } from "../app";
import createConnection from "../database";

describe("Users", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase(); 
        await connection.close();
    });

    it("Should be able to create a new user", async () => {
        const response = await request(app).post("/users").send({
                email: "user@example.com",
                name: "User Example"
        });

        expect(response.status).toBe(201);
    });

    it("Should not be able to create a new user with existing email", async () => {
        const response = await request(app).post("/users").send({
                email: "user@example.com",
                name: "User Example"
        });

        expect(response.status).toBe(400);
    });

    it("Should be able to get all users", async () => {
        const response = await request(app).post("/users").send({
            email: "user2@example.com",
            name: "User 2 Example"
        });

        expect(response.status).toBe(201);

        const getResponse = await request(app).get("/users");

        expect(getResponse.body.length).toBe(2);
    });

    it("Should be able to edit a user", async () => {
        const response = await request(app).post("/users").send({
            email: "user3@example.com",
            name: "User 3 Example"
        });

        expect(response.status).toBe(201);

        let secondUser = response.body;

        secondUser.name = "User 3 Example Edit";

        const patchResponse = await request(app).patch("/users").send({
            name: secondUser.name, 
            id: secondUser.id
        });

        expect(patchResponse.body.name).toBe("User 3 Example Edit");
    });

    it("Should be able to delete users", async () => {
        const response = await request(app).post("/users").send({
            email: "user4@example.com",
            name: "User 4 Example"
        });

        expect(response.status).toBe(201);

        const deleteResponse = await request(app).delete(`/users/${response.body.id}`);

        expect(deleteResponse.status).toBe(200);

        const getResponse = await request(app).get("/users");

        expect(getResponse.body.length).toBe(3);
    });
});