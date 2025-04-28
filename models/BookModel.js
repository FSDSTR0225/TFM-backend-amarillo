const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    like: {
      type: Number,
      default: 0,
    },
    dislike: {
      type: Number,
      default: 0,
    },
    state: {
      type: Number,
      default: 0, // Este campo se usa para el porcentaje de progreso
    },
    review: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
      },
    ],
    genre: {
      type: [String],
    }, 
    author: {
      type: [String],
    },language: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  {
    timestamps: true, // Añade campos createdAt y updatedAt automáticamente
  }
);

module.exports = mongoose.model("Book", bookSchema);
