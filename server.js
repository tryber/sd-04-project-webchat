const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const path = require('path');
const faker = require('faker'); // Gera dados fakes no browser, Ex.: nome, cidade
const messages = require('./model/modelMessages');
const createOn = require('./service/timeNow');

const app = express();

// Criando servidor
const socketIoServer = http.createServer(app);
const io = socketio(socketIoServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

io.on('connect', async (socket) => {
  faker.locale = 'pt_BR'; // define o idioma dos dados
  // console.log(
  //   `Socket conectado: ${socket.id} - Nome: ${faker.name.findName()}`,
  // );
  // console.log(`Usuários conectados ${socket.rooms}`);

  /**
   *  Quando o cliente conecta no chat,
   *  carrega todas as mensagens que estão salvas no banco.
   */
  const Messages = await messages.getAllMessages();
  socket.emit('previousMessage', Messages);

  // Gerando nome dos usuários conectados
  const users = [];
  await users.push(faker.name.findName());
  socket.emit('userConected', users);

  /**
   * Salva todas as mensagens do cliente no banco
   * variável data = {dateTime, nickname, chatMessage}
   */

  // Obten data e hora da mensagem
  const dateTime = createOn();
  socket.on('message', (data) => {
    try {
      messages.saveMessage(dateTime, data.nickname, data.chatMessage);
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
    const message = `${dateTime} - ${data.nickname}: ${data.chatMessage}`;
    console.log('vamos ver', message);
    /**
     * Envia a mensagem digitada para todos clientes,
     * utilizando a variável data.
     */
    socket.broadcast.emit('message', message);
    socket.emit('message', message);
  });
});

// Ouvindo a porta 3000
socketIoServer.listen(3000);
console.log('Express na porta 3000');
