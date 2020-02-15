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
    console.log(stdout);
  });
  res.sendFile(path.join(__dirname,'/views/home.html'));
});

app.listen(8000, (req,res) => {
  console.log("Servidor en puerto "+ 8000);
});
