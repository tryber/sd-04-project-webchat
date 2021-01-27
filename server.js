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

const users = {};
io.on('connection', async (socket) => {
  console.log('Conectado');
  const messages = await crudMessages.getAllMessages();
  io.to(socket.id).emit('showMessageHistory', messages, 'public');

  socket.on('userConection', (currentUser) => {
    users[socket.id] = currentUser;
    io.emit('showOnlineUsers', users);
  });

  socket.on('changeNickname', (nickname) => {
    users[socket.id] = nickname;
    io.emit('showOnlineUsers', users);
  });

  socket.on('message', async ({ nickname, chatMessage, receiver }) => {
    let msg = {
      nickname,
      message: chatMessage,
      timestamp: moment(new Date()).format('DD-MM-yyyy hh:mm:ss'),
    };

    if (!receiver) {
      const message = await crudMessages.createMessage(msg);
      io.emit('message', `${message.timestamp} - ${message.nickname}: ${message.message}`, 'public');
    } else {
      msg = { ...msg, receiver };
      io.to(socket.id)
        .to(receiver)
        .emit('message', `${msg.timestamp} (private) - ${msg.nickname}: ${msg.message}`, 'private');
    }
  });
  socket.on('disconnect', () => {
    console.log('Desconectado');
    delete users[socket.id];
    io.emit('showOnlineUsers', users);
  });
});

const PORT = 3000;

server.listen(PORT, () => console.log(`Servidor ouvindo na porta ${PORT}`));
