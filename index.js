const express = require("express");
const app = express();

app.use(express.json());

const VERIFY_TOKEN = "rainha123";

let historico = [];

app.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  res.send("Rainha API Online");
});

app.post("/", (req, res) => {
  const body = req.body;

  console.log("WEBHOOK:", JSON.stringify(body));

  const value = body.entry?.[0]?.changes?.[0]?.value;

  if (value?.statuses) {
    value.statuses.forEach((s) => {
      const evento = {
        id: s.id,
        telefone: s.recipient_id,
        status: s.status,
        data: new Date(Number(s.timestamp) * 1000).toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo"
        }),
        motivo: s.errors ? JSON.stringify(s.errors) : ""
      };

      historico.push(evento);

      console.log("STATUS:", evento.status);
      console.log("DESTINO:", evento.telefone);
      console.log("ID:", evento.id);
    });
  }

  res.sendStatus(200);
});

app.get("/status", (req, res) => {
  res.json(historico);
});

app.get("/status/:telefone", (req, res) => {
  const telefone = req.params.telefone;

  const filtrado = historico.filter(x => x.telefone === telefone);

  res.json(filtrado);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
