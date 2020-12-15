const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const cors = require('cors');

const moment = require('moment');

const { getAllMessages, insertMessage } = require('./models/chatModel');

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.sendFile('index.html');
});

let onlineUsers = [];

// SOCKET.IO
io.on('connection', async (socket) => {
  const allMessages = await getAllMessages();

  io.emit('onlineUsers', onlineUsers);
  let userActual;

  socket.on('newUser', (nick) => {
    console.log('esse é o nome atual', nick);
    userActual = nick;
    onlineUsers.push({ id: socket.id, nick });
    console.log('array de users Online', onlineUsers);
    io.emit('onlineUsers', onlineUsers);
  });

  // const userEffective = {
  //   id: socket.id,
  //   nick: userActual,
  // };

  socket.emit('history', allMessages);

  socket.on('newNickName', (user) => {
    console.log('o novo NICK vindo do front', user);
    onlineUsers.map((nick) => {
      const onlineUser = nick;
      if (onlineUser.nick === userActual) onlineUser.nick = user;
      console.log('novo nickname inserido', onlineUsers);
      return null;
    });
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('disconnect', () => {
    console.log('usuario se desconectou');
    onlineUsers = onlineUsers.filter((user) => user.id !== socket.id);
    console.log('array atualizado depois de sair um user', onlineUsers);
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('message', async (message) => {
    const timeformated = moment(new Date()).format('DD-MM-YYYY h:mm:ss a');
    const fullMsgString = `${timeformated} | ${message.nickname}: ${message.chatMessage}`;
    await insertMessage(message.nickname, message.chatMessage, timeformated);
    io.emit('message', fullMsgString);
  });
});

server.listen(3000, () => console.log('Running on Port 3000'));
