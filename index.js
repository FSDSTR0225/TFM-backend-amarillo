const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

// Middleware para procesar JSON y datos de formularios
app.use(cors()); //cors
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error);
  });

// Rutas de la API




// Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${port}`);
});