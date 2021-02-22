import express, { response } from 'express';

const app = express();

/**
 * 
 * GET => Busca
 * POST => Salvar
 * PUT => Alterar
 * DELETE => Deletar
 * PATCH => Alteração específica
 * 
 **/

app.get("/", (request, response) => {
    return response.json({message: "Hellow World - NWL#4!!"});
});
app.post("/", (request, response) => {
    return response.json({message: "Data saved successfully!"});
});

app.listen(3333, () => console.log("Server is running!"));

