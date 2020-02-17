const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();

app.set('port', process.env.PORT || 3000)

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
  console.log(req.query);
  const directorio = path.join(__dirname, req.query.directory);

  // metodo syncrono que espera a que sea completa para seguir
  const resultado = execSync("ls -l", { cwd: directorio }).toString();

  let listaArchivos = resultado.split("\n");
  listaArchivos = listaArchivos.slice(1, listaArchivos.length - 1);

  let infoArchivos = [];

  for (var i = 0; i < listaArchivos.length; i++) {
    let archivo = listaArchivos[i].split(" ");
  }
});

app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});
