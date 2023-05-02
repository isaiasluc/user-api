import express from "express";
import { Request, Response } from "express";
import bodyParser from "body-parser";

const app = express();
const router = require("./routes/routes");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use("/", router);

app.listen(3000, () => {
  console.log("Servidor rodando");
});
