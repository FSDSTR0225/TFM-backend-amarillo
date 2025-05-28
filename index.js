const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const helmet = require("helmet");
const morgan = require("morgan");
const userRouter = require("./router/UserRouter");
const listRouter = require("./router/ListRouter");
const bookRouter = require("./router/BookRouter");
const tokenRouter = require("./router/TokenRouter");

const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

// Middleware para procesar JSON y datos de formularios
app.use(cors()); //cors

// middleware que añade cabeceras extra de seguridad a las respuestas
app.use(express.urlencoded({ extended: true }));
//mas seguridad al servidor
app.use(helmet());
//para ver las peticiones
app.use(morgan("tiny"));
// Esto expone la carpeta uploads como estática
app.use("/uploads", express.static("uploads"));

// Conexión a MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas");
  })
  .catch((error) => {
    console.error("❌ Error conectando a MongoDB:", error);
  });

// Rutas de la API

app.use("/users", userRouter);
app.use("/lists", listRouter);
app.use("/books", bookRouter);
app.use("/token", tokenRouter);
// Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${port}`);
});
