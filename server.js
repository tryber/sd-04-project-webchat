const app = require('express')();
const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const messageModel = require('./models/Messages');

app.use('/', express.static(path.join(__dirname, 'public')));

let sockets = [];
const obj = {};

io.on('connection', async (socket) => {
  // Helper to create and validate a nickname
  const dispatch = (nickname) => {
    if (!obj.user || !obj.user.includes(nickname)) {
      obj.user = nickname;
      sockets.unshift(obj.user);
      sockets = sockets.filter((este, i) => sockets.indexOf(este) === i);
      console.log(sockets);

      io.emit('userList', sockets);
    }
  };

  console.log('Conectado');
  io.emit('userList', sockets); // Emit online users on connected

  const allMessages = await messageModel.listMessages();
  io.emit('history', allMessages); // Emit history messages on connected

  socket.on('newNick', ({ nickname }) => {
    dispatch(nickname);
  });

  // Create a nick and send a message
  socket.on('message', async ({ nickname, chatMessage }) => {
    await dispatch(nickname);

    const message = await messageModel.insertValues(nickname, chatMessage);

    const completeMessage = `${message.date} ${message.nickname}: ${message.message}`;
    console.log(completeMessage);

    io.emit('message', completeMessage);
  });

  socket.on('disconnect', () => {
    // Split user from array
    sockets.splice(sockets.indexOf(socket), 1);
    const message = `${obj.user} > deixou o chat`;
    console.log(message);

    io.emit('userList', sockets);
  });
});
http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
