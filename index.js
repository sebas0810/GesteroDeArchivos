const express = require("express");
const morgan = require("morgan");
const path = require("path");
const { exec, execSync } = require("child_process");
const app = express();

app.set('port', 8000)

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
      permisos: archivo[0].slice(""),
      tipo: archivo[0].split("")[0],
      propietario: archivo[2],
      nombre: archivo[archivo.length - 1]
    };

    infoArchivos.push(infoArchivo);
  }
  res.json(infoArchivos);
});

app.get("/changeName",(req,res ) => {
  var directorio = req.query.directory
  const nombreArchivoA = req.query.actualName
  const nombreArchivoN = req.query.newName
  console.log("ENTRE UNA CHIMBA");
  directorio = path.join(__dirname, directorio);

  execSync(`mv ${nombreArchivoA} ${nombreArchivoN}`,{ cwd: directorio});

})

app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});
