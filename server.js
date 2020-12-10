const app = require('express')();
const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
const path = require('path');

const messageModel = require('./models/Messages');

app.use(cors());
app.use('/', express.static(path.join(__dirname, 'public')));

let sockets = [];
const obj = {};

io.on('connection', async (socket) => {
  console.log('Conectado');
  io.emit('userList', sockets);

  const allMessages = await messageModel.listMessages();
  io.emit('history', allMessages);

  const dispatch = (nickname) => {
    if (!obj.user || !obj.user.includes(nickname)) {
      obj.user = nickname;
      sockets.unshift(obj.user);
      sockets = sockets.filter((este, i) => sockets.indexOf(este) === i);
      console.log(sockets);

      io.emit('userList', sockets);
    }
  };

  socket.on('newNick', async ({ nickname }) => {
    await dispatch(nickname);
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    await dispatch(nickname);

    const message = await messageModel.insertValues(nickname, chatMessage);

    const completeMessage = `${message.date} ${message.nickname}: ${message.message}`;
    console.log(completeMessage);

    io.emit('message', completeMessage);
  });

  socket.on('disconnect', () => {
    /* sockets.splice(sockets.indexOf(socket), 1); */
    const message = `${obj.user} > deixou o chat`;
    console.log(message);
    sockets.splice(obj.user);
    io.emit('userList', sockets);
  });
});
http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
