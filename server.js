const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const moment = require('moment');
const crudMessages = require('./models/crudMessages');

const app = express();

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'public')));

io.on('connection', async (socket) => {
  console.log('Conectado');
  const messages = await crudMessages.getAllMessages();
  io.to(socket.id).emit('showMessageHistory', messages);

  const users = {};

  socket.on('userConection', (currentUser) => {
    users[socket.id] = currentUser;
    io.emit('displayUsers', users);
  });

  socket.on('changeNickname', (nickname) => {
    users[socket.id] = nickname;
    io.emit('displayUsers', users);
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    const msg = {
      nickname,
      message: chatMessage,
      timestamp: moment(new Date()).format('DD-MM-yyyy hh:mm:ss'),
    };
    const message = await crudMessages.createMessage(msg);
    io.emit('message', `${message.timestamp} - ${message.nickname}: ${message.message}`);
  });
  socket.on('disconnect', () => {
    console.log('Desconectado');
  });
});

const PORT = 3000;

server.listen(PORT, () => console.log(`Servidor ouvindo na porta ${PORT}`));
