const cors = require('cors');
const path = require('path');
const http = require('http');
const express = require('express');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(cors());

app.use('/', express.static(path.join(__dirname, 'public')));

const { insertMessage, getAllMessages } = require('./model/messagesModel');

let usersList = [];
const obj = {};

const dispatcher = (nickname) => {
  if (!obj.user || !obj.user.includes(nickname)) {
    obj.user = nickname;
    usersList.unshift(obj.user);
    usersList = usersList.filter((user, i) => usersList.indexOf(user) === i);

    io.emit('userList', usersList);
  }
};

io.on('connection', async (socket) => {
  console.log('Connected');
  io.emit('usersList', usersList);

  const allMessages = await getAllMessages();
  io.emit('history', allMessages);

  socket.on('newNickName', async ({ nickname }) => {
    await dispatcher(nickname);
  });

  socket.on('chatMessage', async ({ nickname, chatMessage }) => {
    await dispatcher(nickname);

    const time = new Date();
    const timestamp = moment(time).format('DD-MM-yyyy HH:mm:ss');

    await insertMessage(chatMessage, nickname, timestamp);

    const fullMessage = `${timestamp} - ${nickname}: ${chatMessage}`;
    console.log(fullMessage);

    io.emit('chatMessage', fullMessage);
  });

  socket.on('disconnect', () => {
    const message = `${obj.user} > left chat`;
    console.log(message);

    usersList.splice(obj.user);
    io.emit('userList', usersList);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
