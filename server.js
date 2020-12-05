const app = require('express')();
const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const messageModel = require('./models/Messages');

require('dotenv').config();

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

io.on('connection', async (socket) => {
  console.log('Conectado');
  socket.on('disconnect', () => {
    console.log('Desconectado');
  });
  socket.on('message', async ({ nickname, chatMessage }) => {
    const message = await messageModel.insertValues(nickname, chatMessage);

    console.log(message);

    const completeMessage = `${message.date} ${message.nickname}: ${message.message}`;

    io.emit('message', completeMessage);
  });
});
http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
