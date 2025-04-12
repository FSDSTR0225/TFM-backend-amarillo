const e = require("cors");
const mongoose = require("mongoose");

// Definimos el esquema de tarea
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    saved: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    read: [
      {
        book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        status: { enum: ["read", "reading", "abandoned"] },
      },
    ],
    preferences: [
      {
        genres: [
          {
            genre: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
            total: Number,
          },
        ],
        languages: [
          {
            language: { type: mongoose.Schema.Types.ObjectId, ref: "Language" },
            total: Number,
          },
        ], //ponerlo en Book
      },
    ],
    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    dislike: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    list: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
      },
    ],
  },
  {
    timestamps: true, // Añade campos createdAt y updatedAt automáticamente
  }
);

// Creamos el modelo a partir del esquema
const Task = mongoose.model("User", UserSchema);

module.exports = Task;
