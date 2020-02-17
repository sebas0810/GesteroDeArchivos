const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();


app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');
//app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, "public")));

app.set('port', process.env.PORT || 3000)

const inicio = require('./root/index.routes')
 //middleware
app.use(express.json());
app.use(morgan("dev"));
//app.use(express.urlencoded({ extended: false }))

app.use(inicio);

app.get('/', (req,res)=>{
  res.render('index.ejs')
});
//app.get('*', (req, res) => res.sendFile(path.join(__dirname+'/public/index.ejs')));

app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});
