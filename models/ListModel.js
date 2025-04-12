const mongoose = require("mongoose");
const { Schema } = mongoose;

const listSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  {
    timestamps: true, // Añade campos createdAt y updatedAt automáticamente
  }
);

module.exports = mongoose.model("List", listSchema);
