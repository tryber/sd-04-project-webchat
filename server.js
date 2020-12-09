const express = require('express');
const path = require('path');
const moment = require('moment');
const chatModel = require('./models/chatModel');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

io.on('connection', async (socket) => {
  console.log('Conectado');

  const allMessages = await chatModel.getMessages();
  allMessages.forEach((message) => {
    const msg = `${message.created_on} - ${message.nickname}: ${message.chatMessage}`;
    socket.emit('oldMessages', msg);
  });

  socket.on('message', async (message) => {
    const time = new Date();
    const timestamp = moment(time).format('DD-MM-yyyy HH:mm:ss');
    await chatModel.writeNewMessage(message.chatMessage, message.nickname, timestamp);
    const msg = `${timestamp} - ${message.nickname}: ${message.chatMessage}`;
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Desconectado')
    io.emit('disconnect', 'Tchau');
  });
});

http.listen(3000, () => {
  console.log('listening on port 3000');
});
