const express = require('express');
const http = require('http');
const socket_io = require('socket.io');
const cors = require('cors');
const path = require('path');
const port = 3000;
const chatModel = require('./model/chatModel');

const app = express();

const socketIoServer = http.createServer();

const io = socket_io(socketIoServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log(`desconectou :(`);
  });

  socket.on('welcome', (data) => {
    console.log(`${data.name} entrou no chat`);
  });

  socket.on('message', async (data) => {
    await chatModel.registerData(data);

    /*     const lastDataRegistered = chatModel.registeredHistoric();
    console.log('THIS IS THE MESSAGE', lastDataRegistered);
 */
    io.emit(
      'historic',
      `${new Date().toLocaleString()} - ${data.nickname} enviou: ${
        data.chatMessage
      }`
    );
  });
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log(`Server http running on 3000 port`);
});

socketIoServer.listen(4555, () => {
  console.log(`Server http running on 4555 port`);
});
