const express = require("express");
const path = require("path");
const fs = require("fs");
const { ejecutar } = require("child_process");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(8000, (req, res) => {
  console.log("Servidor en puerto " + 8000);
});