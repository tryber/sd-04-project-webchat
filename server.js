const express = require('express');
const cors = require('cors');
const path = require('path');
const moment = require('moment');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const chatModel = require('./models/webchatModel');

app.use(cors());
app.use(express.static(path.join(__dirname, '/app')));
app.use('/', express.static(path.join(__dirname, '/app')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let onlineUsers = [];

io.on('connection', async (socket) => {
  console.log('Usuário conectado');

  const chatHistory = await chatModel.getHistory();

  // Emite messagens antigas para todas pessoas usuárias.
  chatHistory.forEach(({ chatMessage, nickname, timestamp }) => {
    const messagesOfThePast = `${timestamp} ${nickname} ${chatMessage}`;
    console.log(`historyEvent: ${messagesOfThePast}`);
    socket.emit('history', messagesOfThePast);
  });

  // No Evento 'message':
  // 1- Converte do timestamp para ser ser salvo no mongo.
  // 2- Emite messagens para todos conectados.
  // 3- Salva mensagem, nickname e timestamp no bd.
  socket.on('message', async ({ nickname, chatMessage }) => {
    console.log(`messageEvent: ${nickname} - ${chatMessage}`);
    const convertedTimestamp = moment().format('DD-MM-yyyy HH:mm:ss');
    const message = `(${convertedTimestamp}) - ${nickname} says: ${chatMessage}`;

    io.emit('message', message);
    return chatModel.saveMessages(chatMessage, nickname, convertedTimestamp);
  });

  // Evento usersOnline: adiciona usuario conectado na lista de usuários online, e emite para todos.
  socket.on('usersOnline', ({ nickname }) => {
    onlineUsers.push({ socketId: socket.id, nickname });
    io.emit('usersOnlineUpdate', onlineUsers);
  });

  // Evento UpdateNickname para atualizar nick do user.
  socket.on('updateNickname', ({ newName }) => {
    console.log(onlineUsers);
    onlineUsers = onlineUsers.filter(({ nickname }) => nickname !== newName);
    console.log(onlineUsers);
    onlineUsers.push({ socketId: socket.id, nickname: newName });
    io.emit('usersOnlineUpdate', onlineUsers);
  });

  // Evento disconnect para retirar o usuário da lista de onlineUsers.
  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(({ socketId }) => socketId !== socket.id);
    io.emit('usersOnlineUpdate', onlineUsers);
  });
});

app.get('/ping', (_, res) => {
  res.status(200).json({ message: 'pong!' });
});

http.listen(3000);
console.log('Express ouvindo na porta 3000');
