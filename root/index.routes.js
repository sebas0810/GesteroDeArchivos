const express = require('express');
const router = express.Router();
const path = require("path");
const { exec, execSync } = require("child_process");

router.get('/carpeta' , (req,res)=>{
  const directorio = path.join(__dirname, "public");
  console.log('Entre '+ directorio);
  // metodo syncrono que espera a que sea completa para seguir
  exec("ls -l", { cwd: '/home/sebastianlopez/'}, (error,stdout, stderr) =>{
    if(error){
      console.log("Errorsote");
      console.log("Error: "+error);
      return
    }
    if(stderr){
      console.log("stderr");
      console.log("Error: "+error);
      return
    }
    let listaArchivos = stdout.split("\n");
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
      infoArchivos.push(JSON.stringify(infoArchivo));
  }
    //console.log(infoArchivos);
    res.json(infoArchivos)
  });
})


module.exports = router;
