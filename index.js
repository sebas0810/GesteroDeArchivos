const express = require("express");
const morgan = require("morgan");
const path = require("path");
const { exec, execSync } = require("child_process");
const app = express();
const fs = require("fs");

app.set("port", 8000);

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

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/files", (req, res) => {
  const directorio = path.join(req.query.directory);

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

app.get("/api/changeName", (req, res) => {
  const dir = req.query.directory;
  const directorio = path.join("/", dir.trim());
  const nombreArchivoA = path.join(directorio, req.query.actualName);
  const nombreArchivoN = path.join(directorio, req.query.newName);

  execSync(`mv ${nombreArchivoA} ${nombreArchivoN}`);
});

//Eliminar Files/Directory
app.get("/api/eliminar", (req, res) => {
  const dir = req.query.directory;
  const directorio = path.join("/", dir.trim());
  const nombreFD = path.join(directorio, req.query.nameFD);

  execSync(`rm -R ${nombreFD}`);
});

app.get("/api/movercortar", (req, res) => {
  const dir = req.query.directory;
  const directorio = path.join("/", dir.trim());
  const rutaFD = path.join(req.query.FD);
  console.log(directorio, rutaFD);
  execSync(`mv ${rutaFD} ${directorio}`);
});

app.get("/api/copiarpegar", (req, res) => {
  const dir = req.query.directory;
  const directorio = path.join("/", dir.trim());
  const rutaFD = path.join(req.query.FD);
  console.log(directorio, rutaFD);

  execSync(`cp -r ${rutaFD} ${directorio}`);
});

// Endpoint para crear archivos en la ruta seleccionada
app.get("/api/createFile", (req, res) => {
  const directorio = path.join(req.query.directory);
  const nombreArchivo = req.query.name;

  execSync(`touch ${nombreArchivo}`, { cwd: directorio });
});

app.get("/api/createFolder", (req, res) => {
  const directorio = path.join(req.query.directory);
  const nombreCarpeta = req.query.name;

  execSync(`mkdir ${nombreCarpeta}`, { cwd: directorio });
});

app.get('/api/changePermissions', (req, res) => {
  const archivo = req.body.file
  const modo = req.body.mode

  execSync(`chmod ${modo} ${archivo}`)
})

app.listen(app.get("port"), () => {
  console.log(`server on port ${app.get("port")}`);
});
