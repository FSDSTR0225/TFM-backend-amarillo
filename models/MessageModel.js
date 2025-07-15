const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
  {

     userID: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true,
    },
    user: {
      type: String,
      required: true,
      trim: true,
    },
    text: 
      {
       type: String,
      required: true,
      trim: true,
      },
      bookID: {
        
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
     
    },
    reader:{
      type: Boolean,
      default: false, // Por defecto, el mensaje no es leído
    }
  },
  {
    timestamps: true, // Añade campos createdAt y updatedAt automáticamente
  }
);

module.exports = mongoose.model("Message", messageSchema);
