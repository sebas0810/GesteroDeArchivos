const express = require('express')
const path = require('path')
const fs = require('fs')
const { exec } = require("child_process")
const morgan = require('morgan')
const app = express()

app.use(morgan('dev'))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req,res) =>{
  const dir = '/home/sebastianlopez';
  exec('ls -l',{cwd: dir},(error,stdout,stderror)=>{
    if(error){
      console.log('Error:'+ error.menssage);
      return;
    }
    if(stderror){
      console.log('Stderror:'+ stderror.menssage);
      return;
    }
    let archivosList = stdout.split('\n');
    archivosList = archivosList.slice(1,archivosList.length-1);
    let resultadoJ = [];
    for (var i = 0; i < archivosList.length; i++) {
      let archivo = archivosList[i].split(' ');
      resultadoJ.push({
        permisos : archivo[0].slice(''),
        tipo : archivo[0].split('')[0],
        propietario : archivo[2],
        nombre : archivo[archivo.length-1]
      });
    }
    //console.log(resultadoJ);
  });
  res.json(resultadoJ);
});

app.listen(8000, (req,res) => {
  console.log("Servidor en puerto "+ 8000);
});
