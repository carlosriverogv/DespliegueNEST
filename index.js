/*
Práctica 2 - Despliegue de Aplicaciones Web - 2DAMDAW

Autor: Liam Alejo Asensi
*/

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');
const methodOverride = require('method-override');

dotenv.config();

const habitaciones = require(__dirname + '/routes/habitaciones');
const limpiezas = require(__dirname + '/routes/limpiezas');
const auth = require(__dirname + '/routes/auth');

mongoose.connect(process.env.URL_BD);

let app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
}).addFilter('date', dateFilter);

app.set('view engine', 'njk');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));

app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false,
  expires: new Date(Date.now() + (30 * 60 * 1000))
}));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use('/habitaciones', habitaciones);
app.use('/limpiezas', limpiezas);
app.use('/auth', auth);

app.get('/', (req, res) => {
  res.redirect('/habitaciones');
});

app.listen(process.env.PUERTO);