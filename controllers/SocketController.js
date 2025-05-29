const Message = require('../models/MessageModel'); // Ajusta ruta si es necesario


function socketHandler(io) {

  io.on('connection', async (socket)  => {
    console.log(`🔌 Usuario conectado: ${socket.id}`);

     try {
      const previousMessages = await Message.find()
        .sort({ createdAt: 1 }) // Orden cronológico ascendente
        .limit(50);

      socket.emit('chat history', previousMessages);
    } catch (error) {
      console.error('❌ Error al cargar mensajes anteriores:', error);
    }

    // Escuchar eventos
    socket.on('chat message', async  (msg) => {
         const messageWithTime = {
      ...msg,
    };

     try {
        await Message.create({
          userID: msg.id,
          user: msg.sender,
          text: msg.text,
        });
        console.log('💾 Mensaje guardado en MongoDB');
      } catch (error) {
        console.error('❌ Error al guardar mensaje:', error);
      }
      console.log(`📩 Mensaje recibido: ${messageWithTime}`);
      io.emit('chat message', messageWithTime); // Reenviar a todos los clientes
    });

    socket.on('disconnect', () => {
      console.log(`❌ Usuario desconectado: ${socket.id}`);
    });
  });
}

module.exports = socketHandler;