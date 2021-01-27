const express = require('express');
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const moment = require('moment');
const messagesModel = require('./models/messagesModel');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'public')));

const users = {};
io.on('connection', async (socket) => {
  console.log('user connected');
  const messages = await messagesModel.getMessages();
  io.to(socket.id).emit('showMessageHistory', messages, 'public');

  socket.on('userConection', (currentUser) => {
    users[socket.id] = currentUser;
    io.emit('showOnlineUsers', users);
  });
  socket.on('changeNickname', (nickname) => {
    users[socket.id] = nickname;
    io.emit('showOnlineUsers', users);
  });

  socket.on('message', async ({ nickname, chatMessage, receiver }) => {
    let msg = {
      nickname,
      message: chatMessage,
      timestamp: moment(new Date()).format('DD-MM-yyyy hh:mm:ss'),
    };
    if (!receiver) {
      const message = await messagesModel.newMessage(msg);
      io.emit('message', `${message.timestamp} - ${message.nickname}: ${message.message}`, 'public');
    } else {
      msg = { ...msg, receiver };
      io.to(socket.id)
        .to(receiver)
        .emit('message', `${msg.timestamp} (private) - ${msg.nickname}: ${msg.message}`, 'private');
    }
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
    delete users[socket.id];
    io.emit('showOnlineUsers', users);
  });
});

const { PORT } = process.env;

server.listen(PORT, () => console.log(`listening on ${PORT}`));
