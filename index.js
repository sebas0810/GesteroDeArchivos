const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();

app.set('port', process.env.PORT || 3000)

const inicio = require('./root/index.routes')
 //middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }))

app.use(inicio);

//app.use('view engine', 'ejs');
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, "public")));

app.get('*', (req, res) => res.sendFile(path.join(__dirname+'/public/index.html')));

app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});
