const express = require("express");
const app = express();

app.use(express.json());

const VERIFY_TOKEN = "rainha123";

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
  console.log("WEBHOOK:", JSON.stringify(req.body));

  const value =
    req.body?.entry?.[0]?.changes?.[0]?.value;

  if (value?.statuses) {
    value.statuses.forEach((s) => {
      console.log("STATUS:", s.status);
      console.log("DESTINO:", s.recipient_id);
      console.log("ID:", s.id);
    });
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
