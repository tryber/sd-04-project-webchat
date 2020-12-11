const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const path = require('path');
const messages = require('./model/modelMessages');
const createOn = require('./service/timeNow');

const app = express();

// Criando servidor
const socketIoServer = http.createServer(app);
const io = socketio(socketIoServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/client', express.static(path.join(__dirname, 'public')));

io.on('connect', async (socket) => {
  console.log(`Socket conectado: ${socket.id}`);
  // console.log(`Usuários conectados ${socket.rooms}`);

  /**
   *  Quando o cliente conecta no chat,
   *  carrega todas as mensagens que estão salvas no banco.
   */
  const Messages = await messages.getAllMessages();
  // const msn = await formatMessage(Messages, true);
  // console.log('todos', msn);
  socket.emit('previousMessage', Messages);

  /**
   * Salva todas as mensagens do cliente no banco
   * variável data = {dateTime, nickname, chatMessage}
   */
  socket.on('message', (data) => {
    try {
      // Obten data e hora da mensagem
      const dateMessage = createOn();
      messages.saveMessage(
        data.dateTime = dateMessage,
        data.nickname,
        data.chatMessage,
      );
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
    const message = `${data.dateTime} - ${data.nickname}: ${data.chatMessage}`;
    console.log('vamos ver', message);
    /**
     * Envia a mensagem digitada para todos clientes,
     * utilizando a variável data.
     */
    socket.broadcast.emit('message', message);
    socket.emit('message', message);
  });
});

socketIoServer.listen(3000);
console.log('Express na porta 3000');
