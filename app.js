var express = require('express')
const bodyParser= require('body-parser');
require('./db/connection.js')
var path = require('path');
var app = express()
const port =4400
var itemRoutes = require('./routers/itemRoutes')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/items',itemRoutes)

app.listen(port,()=>{
    console.log(`Server is running on port no ${port}`)
  })
  module.exports= app.listen(3000);