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

app.use(express.static(path.join(__dirname, "public")));


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

// app.get("/", (req,res)=>{
//   res.render('welcome')
// })

app.get("/changeName",(req,res ) => {
  const dir = req.query.directory
  const directorio = path.join(__dirname+'/',dir.trim());
  const nombreArchivoA = path.join(directorio,req.query.actualName)
  const nombreArchivoN = path.join(directorio,req.query.newName)

  execSync(`mv ${nombreArchivoA} ${nombreArchivoN}`);

});

app.get("/eliminar",(req,res) =>{
  const dir = req.query.directory;
  const directorio = path.join(__dirname+'/',dir.trim());
  const nombreFD = path.join(directorio,req.query.nameFD)

  execSync(`rm -R ${nombreFD}`);
});

app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});
