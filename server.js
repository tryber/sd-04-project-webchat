require('dotenv/config');
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const moment = require('moment');
const Model = require('./models/chatModel');
const faker = require('faker');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

let users = [];

const formatMessage = (nickname, message, timestamp) =>
  `${timestamp} - ${nickname}: ${message}`;

const formatMessagePrivate = (nickname, message, timestamp) =>
  `${timestamp} (private) - ${nickname}: ${message}`;

// Faker utilizado para gerar o botão e não me confundir com Anonymous

// Conexão
io.on('connection', async (socket) => {
  const user = {
    id: socket.id,
    nickname: faker.name.firstName(),
  };

  io.emit('onlineUsers', [...users, user]);
  users.push(user);

  const history = await Model.getMessages();
  socket.emit('history', history);

  // socket.broadcast.emit('message', 'New user logged');

  socket.on('changeNick', (nickname) => {
    user.nickname = nickname;
    users.push(user);
    io.emit('onlineUsers', users);
  });

  socket.on('message', async ({ chatMessage, nickname, receiver }) => {
    const date = Date.now();
    const time = moment(date).format('DD-MM-YYYY h:mm:ss a');

    if (!receiver) {
      io.emit('message', formatMessage(nickname, chatMessage, time));
      // save in BD
      await Model.saveMessage(chatMessage, nickname, time);
    } else {
      socket
        .to(receiver)
        .emit('message', formatMessagePrivate(nickname, chatMessage, time));
      socket.emit('message', formatMessagePrivate(nickname, chatMessage, time));
      await Model.saveMessage(chatMessage, nickname, time);
    }
  });

  // socket.on('private', (data) => {
  //   socket.to(data.to).emit('message', data.msg)
  // })

  socket.on('disconnect', () => {
    users = users.filter((person) => socket.id !== person.id);
    io.emit('onlineUsers', users);
  });
});

server.listen(PORT, () => console.log(`Ouvindo na porta ${PORT}`));
