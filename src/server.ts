import "reflect-metadata";
import express from "express";
import "./database";
import { router } from "./routes";

const app = express();

app.use(express.json());

app.get("/", (request, response) => {
    return response.json({message: "Hellow World - NWL#4!!"});
});

app.use(router);

app.listen(3333, () => console.log("Server is running!"));

