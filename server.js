const express = require('express');

const app = express();
const path = require('path');
const http = require('http');
const moment = require('moment');

const socketServer = http.createServer(app);
const io = require('socket.io')(socketServer);

let onlineUsers = [];

const models = require('./models/messagesModel');

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '/')));

io.on('connection', async (socket) => {
  const msgHistory = [];
  io.emit('onlineUsers', onlineUsers);
  let loggedNickname;

  const callHistory = await models.getAllMessages();
  callHistory.map((msg) => {
    const { chatMessage, nickname, timestamp } = msg;
    return msgHistory.push(`${timestamp} - ${nickname}: ${chatMessage}`);
  });
  socket.emit('history', msgHistory);

  const privateHistory = {};
  socket.emit('private-history', privateHistory);

  socket.on('private-message', ({ to, message, from }) => {
    console.log('server', message);
    const newDate = new Date();
    const timestamp = moment(newDate).format('DD-MM-yyyy HH:mm:ss');
    const newMessage = `${timestamp} - ${from}: ${message}`;
    io.to(to)
      .to(socket.id)
      .emit('message', newMessage);
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const newDate = new Date();
    const timestamp = moment(newDate).format('DD-MM-yyyy HH:mm:ss');
    const newMsg = `${timestamp} - ${nickname}: ${chatMessage}`;
    io.emit('message', newMsg);
    await models.sendMessage(chatMessage, nickname, timestamp);
  });

  socket.on('newLogin', async ({ nickname }) => {
    loggedNickname = nickname;
    onlineUsers.push({ socketId: socket.id, nickname });
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('newNickName', ({ newNickName }) => {
    onlineUsers.map((user) => {
      const person = user;
      if (person.nickname === loggedNickname) {
        person.nickname = newNickName;
      }
      return null;
    });
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(({ socketId }) => socketId !== socket.id);
    io.emit('onlineUsers', onlineUsers);
  });
});

socketServer.listen(3000, () => console.log('Ouvindo na porta 3000'));
