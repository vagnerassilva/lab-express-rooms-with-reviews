require("dotenv").config();
const express = require("express");

const connectToDb = require("./config/db.config");
const userRouter = require("./routes/user.routes");

const app = express();

app.use = express();

async function init() {
  try {
    await connectToDb();

    console.log("Conectando ao BD");

    app.use("/", userRouter);

    app.use((err, req, res) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
    });

    app.listen(1234, () => console.log("Servidor rodando na porta 1234"));
  } catch (err) {
    console.log("Erro ao conectar ao banco de dados", err);
    process.exit(1);
  }
}
init();