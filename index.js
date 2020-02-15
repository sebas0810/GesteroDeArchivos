const express = require("express");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
  const directorio = path.join(__dirname, "public");

  // metodo syncrono que espera a que sea completa para seguir
  const comando = execSync("ls -l", { cwd: directorio }).toString();

  let listaArchivos = comando.split("\n");
  listaArchivos = listaArchivos.slice(1, listaArchivos.length - 1);

  let infoArchivos = [];

  for (var i = 0; i < listaArchivos.length; i++) {
    let archivo = listaArchivos[i].split(" ");

    const infoArchivo = {
      permisos: archivo[0].slice(""),
      tipo: archivo[0].split("")[0],
      propietario: archivo[2],
      nombre: archivo[archivo.length - 1]
    };

    infoArchivos.push(infoArchivo);
  }
  res.json(infoArchivos);
});

app.listen(8000, (req, res) => {
  console.log("Servidor en puerto " + 8000);
});
