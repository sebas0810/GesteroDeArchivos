const express = require("express");
const path = require("path");
const fs = require("fs");
const { exec, execSync } = require("child_process");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.static(path.join(__dirname, "views")));

app.get("/files", (req, res) => {
  const directorio = path.join(__dirname, req.query.directory);

  // metodo syncrono que espera a que sea completa para seguir
  const resultado = execSync("ls -l", { cwd: directorio }).toString();

  let listaArchivos = resultado.split("\n");
  listaArchivos = listaArchivos.slice(1, listaArchivos.length - 1);

  let infoArchivos = [];

  for (var i = 0; i < listaArchivos.length; i++) {
    let archivo = listaArchivos[i].split(" ");

    const infoArchivo = {
      permisos: archivo[0].slice(1, archivo[0].length - 1),
      tipo: archivo[0].split("")[0],
      propietario: archivo[2],
      nombre: archivo[archivo.length - 1]
    };

    infoArchivos.push(infoArchivo);
  }
  res.json(infoArchivos);
});

// Endpoint para crear archivos en la ruta seleccionada
app.get("/createFile", (req, res) => {
  const directorio = path.join(__dirname, req.query.directory);
  const nombreArchivo = req.query.name;

  execSync(`touch ${nombreArchivo}`, { cwd: directorio });
});

app.get("/createFolder", (req, res) => {
  const directorio = path.join(__dirname, req.query.directory);
  const nombreCarpeta = req.query.name;

  execSync(`mkdir ${nombreCarpeta}`, { cwd: directorio });
});

app.listen(8000, (req, res) => {
  console.log("Servidor en puerto " + 8000);
});
