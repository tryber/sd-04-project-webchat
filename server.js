const express = require('express');
const http = require('http');
const cors = require('cors')();
const socketIo = require('socket.io');
const path = require('path');
const moment = require('moment');
const { insertMessage, findAllMessages } = require('./models/messageModel');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const socketIoServer = http.createServer(app);
const io = socketIo(socketIoServer);

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors);

const onlineUsers = {};
const now = moment(new Date()).format('DD-MM-yyyy HH-mm-ss');

io.on('connection', async (socket) => {
  const history = await findAllMessages('messages');
  socket.emit('setHistory', history);
  io.to(socket.id).emit('setHistory', history, 'public');

  socket.on('setNickname', (nickname) => {
    onlineUsers[socket.id] = nickname;
    io.emit('setUsers', onlineUsers);
  });

  socket.on('message', async ({ nickname, message, receiver }) => {
    let formatedMessage;
    if (!receiver) {
      formatedMessage = await insertMessage({
        nickname,
        message,
        timestamp: now,
      },
        'messages');
      return io.emit('menssage', `${formatedMessage.timestamp} - ${nickname}: ${message}, public`);
    }

    formatedMessage = await insertMessage({
      nickname,
      message,
      timestamp: now,
      receiver,
    },
      'private');

    io.to(socket.id)
      .to(receiver)
      .emit('menssage', `${formatedMessage.timestamp} (private) - ${nickname}: ${message}, private`);
  });

  socket.on('disconnect', async () => {
    delete onlineUsers[socket.id];
    io.emit('setUsers', onlineUsers);
  });

  socket.on('error', (error) => console.error(error));
});

socketIoServer.listen(PORT, () => {
  console.log(`Servidor ouvindo a porta ${PORT}`);
});
