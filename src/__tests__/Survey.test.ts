import request from "supertest";
import { getConnection } from "typeorm";
import { app } from "../app";
import createConnection from "../database";

describe("Surveys", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase(); 
        await connection.close();
    });

    it("Should be able to create a new survey", async () => {
        const response = await request(app).post("/surveys").send({
                title: "Survey test 1 title",
                description: "Survey test 1 description"
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    it("Should be able to edit a survey", async() => {
        const response = await request(app).post("/surveys").send({
            title: "Survey test 2 title",
            description: "Survey test 2 description"
        });

        expect(response.status).toBe(201);

        let survey2 = response.body;

        survey2.title = "Survey test 2 title edit";
        survey2.description = "Survey test 2 description edit";

        const editResponse = await request(app).patch("/surveys").send({
            title: survey2.title,
            description: survey2.description,
            id: survey2.id
        });

        expect(editResponse.status).toBe(200);
        expect(editResponse.body.title).toBe("Survey test 2 title edit");
    });

    it("Should be able to get all surveys", async () => {
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
});