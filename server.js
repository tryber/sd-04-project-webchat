const socketIo = require('socket.io');
const moment = require('moment');
const express = require('express');
const http = require('http');
const path = require('path');
const { messageModel } = require('./models/messages');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

io.on('connection', async (socket) => {
  const historicList = await messageModel.getAll();

  historicList.forEach(({ chatMessage, nickname, timestamp }) => {
    const message = `${timestamp} - ${nickname}: ${chatMessage}`;
    socket.emit('history', message);
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const time = new Date();
    const timestamp = moment(time).format('DD-MM-yyyy HH:mm:ss');
    await messageModel.create(chatMessage, nickname, timestamp);
    const message = `${timestamp} - ${nickname}: ${chatMessage}`;

    io.emit('message', message);
  });

  socket.on('changeNickname', ({ newNickname }) => {
    io.emit('changeNickname', newNickname);
  });

  let usersArray = [];

  socket.on('logged-users', ({ nickname }) => {
    usersArray.push({ socketId: socket.id, nickname });
    io.emit('online-users', usersArray);
  });

  socket.on('changeNickname', ({ newNickname }) => {
    usersArray.filter(({ nickname }) => nickname !== newNickname);
    usersArray.push({ socketId: socket.id, nickname: newNickname });
    io.emit('online-users', usersArray);
  });

  socket.on('disconnect', () => {
    usersArray.filter(({ socketId }) => socketId !== socket.id);
    usersArray = [];
    io.emit('online-users', usersArray);
  });
});

server.listen(PORT, () => {
  console.log(`Ouvindo na porta: ${PORT}`);
});
