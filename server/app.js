var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); //Importamos Cors para permitir llamadas desde FrontEnd

var indexRouter = require('./routes');
var usersRouter = require('./routes/users');
var patientRouter = require('./routes/patient.routes');

var app = express();

app.use(cors()); //Usamos CORS
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/patients', patientRouter);


module.exports = app;
