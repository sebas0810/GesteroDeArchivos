const express = require('express')
const app = express()

app.get('/',(req,res) =>{
  req.send("Que vez");
});

app.listen(8000, (req,res) => {
  console.log("Servidor en puerto"+ 8000);
});
