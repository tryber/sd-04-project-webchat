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

const sockets = [];

io.on('connection', async (socket) => {
  const obj = {};
  console.log('Conectado');

  const allMessages = await messageModel.listMessages();
  console.log(allMessages);

  io.emit('history', allMessages);

  socket.on('message', async ({ nickname, chatMessage }) => {
    if (!obj.user || !obj.user.includes(nickname)) {
      obj.user = nickname;
    }

    sockets.unshift(obj.user);
    const novaArr = sockets.filter((este, i) => sockets.indexOf(este) === i);
    console.log(novaArr);

    io.emit('userList', novaArr);
    const message = await messageModel.insertValues(nickname, chatMessage);

    const completeMessage = `${message.date} ${message.nickname}: ${message.message}`;
    console.log(completeMessage);

    io.emit('message', completeMessage);
  });

  socket.on('disconnect', () => {
    sockets.splice(sockets.indexOf(socket), 1);
    const message = `${obj.user} > deixou o chat`;
    console.log(sockets);
    console.log(message);
  });
});
http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
