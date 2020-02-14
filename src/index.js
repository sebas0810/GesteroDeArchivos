const express = require('express')
const path = require('path')
const { ejecutar } = require("child_process")
const app = express()

app.get('/', (req,res) =>{
  const dir = path.join(__dirname)
  res.send(dir)
});

app.listen(8000, (req,res) => {
  console.log("Servidor en puerto"+ 8000);
});
