const Message = require("../models/MessageModel"); // Ajusta ruta si es necesario
const RoomModel = require("../models/RoomModel");

function socketHandler(io) {
  io.on("connection", async (socket) => {
    console.log(`🔌 Usuario conectado: ${socket.id}`);

    // Unirse a la sala
    socket.on("room join", async (msg) => {
      try {
        let room;
        if (msg.idroom) {
          room = await RoomModel.findById(msg.idroom);
        } else {
          //asegura que el array contenga todos los elementos listados, en cualquier orden
          room = await RoomModel.findOne({
            users: { $all: [msg.userid1, msg.userid2] },
          });
        }

        if (!room) {
          room = new RoomModel({
            users: [msg.userid1, msg.userid2],
          });
          await room.save();
          console.log("🆕 Sala creada:", room);
        }
        socket.join(room._id.toString());
        socket.roomId = room._id.toString();
        socket.emit("room joined", { roomId: room._id.toString() });
      } catch (error) {
        console.error("❌ Error al crear/cargar sala o historial:", error);
      }
    });
    // Cargar mensajes anteriores al unirse a la sala
    socket.on("chat history", async (msg) => {
      // Cargar mensajes anteriores
      const previousMessages = await RoomModel.findById(msg.roomId).populate({
        path: "messages",
        options: {
          sort: { createdAt: 1 }, // ordenar mensajes antiguos a nuevos
          limit: 50, // limitar a 50 mensajes
        },
      });
      console.log("Historial de mensajes:", previousMessages);

      // Enviar historial al cliente
      socket.emit("chat history", previousMessages.messages);
    });

    // Enviar mesaje
    socket.on("chat message", async (msg) => {
      try {
        const messageNew = await Message.create({
          userID: msg.id,
          user: msg.sender,
          text: msg.text,
        });

        console.log("id room enviar", msg.roomId);
        await RoomModel.findByIdAndUpdate(msg.roomId, {
          $push: { messages: messageNew._id },
        });

        io.emit("chat message", messageNew);
        console.log("📩 Mensaje enviado:", messageNew.text);
      } catch (error) {
        console.error("❌ Error al enviar mensaje:", error);
      }
    });

    // Eliminar mensaje
    socket.on("delete message", async (msg) => {
      try {
        // Eliminar la referencia al mensaje en el array messages de la sala
        const result = await RoomModel.findOneAndUpdate(
          { _id: msg.roomId },
          {
            $pull: { messages: msg.id },
          }
        );

        if (!result) {
          console.error("❌ ROOM no encontrado:", msg.roomId);
          return;
        }

        // Eliminar el mensaje de la colección Message
        const message = await Message.findByIdAndDelete(msg.id);
        if (!message) {
          console.error("❌ Mensaje no encontrado:", msg.id);
          return;
        }

        console.log("🗑️ Mensaje eliminado:", message.text);
        // Notificar a los usuarios de la sala que el mensaje fue eliminado
        socket.to(msg.roomId).emit("message deleted", { id: msg.id });
      } catch (error) {
        console.error("❌ Error al eliminar mensaje:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Usuario desconectado: ${socket.id}`);
    });
  });
}

module.exports = socketHandler;
