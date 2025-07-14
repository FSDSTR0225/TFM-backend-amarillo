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
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
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
        genres: [String],
        languages: [String],
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
    savedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  },
  {
    timestamps: true, // Añade campos createdAt y updatedAt automáticamente
  }
);

// Creamos el modelo a partir del esquema
const Task = mongoose.model("User", UserSchema);

module.exports = Task;
