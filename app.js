const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const helmet = require("helmet");
const morgan = require('morgan');
const userRouter = require('./router/UserRouter');
const listRouter = require('./router/ListRouter');
const bookRouter = require('./router/BookRouter');
const tokenRouter = require('./router/TokenRouter');

const app = express();
const cors = require("cors");


// Middleware para procesar JSON y datos de formularios
app.use(cors()); //cors

// middleware que añade cabeceras extra de seguridad a las respuestas
app.use(express.urlencoded({ extended: true }));
//mas seguridad al servidor
app.use(helmet());
//para ver las peticiones
app.use(morgan('tiny'));




// Rutas de la API

app.use('/users', userRouter);
app.use('/lists', listRouter);
app.use('/books', bookRouter);
app.use('/token', tokenRouter);


module.exports = app;