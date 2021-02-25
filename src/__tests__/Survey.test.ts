import request from "supertest";
import { app } from "../app";
import createConnection from "../database";

describe("Surveys", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    it("Should be able to create a new survey", async () => {
        const response = await request(app).post("/surveys").send({
                title: "Survey test title",
                description: "Survey test description"
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    it("Should be able to get all surveys", async () => {
        await request(app).post("/surveys").send({
            title: "Title example get",
            description: "test description 2"
        });

        const response = await request(app).get("/surveys");
        expect(response.body.length).toBe(2);
    });

    it("Should be able to delete a survey", async () => {
        const response = await request(app).post("/surveys").send({
            title: "Title delete example",
            description: "test delete description"
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");

        const deleteResponse = await request(app).delete(`/surveys/${response.body.id}`);

        expect(deleteResponse.status).toBe(200);

        const getResponse = await request(app).get("/surveys");
        expect(getResponse.body.length).toBe(2);
    });

    it("Should not be able to delete a survey without declaring an ID", async () => {
        const deleteResponse = await request(app).delete(`/surveys`);

        expect(deleteResponse.status).toBe(404);
    });
});