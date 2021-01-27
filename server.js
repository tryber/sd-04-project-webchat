const express = require('express');
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const moment = require('moment');
const { emit } = require('process');

const messagesModel = require('./models/messagesModel');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'public')));

io.on('connection', async (socket) => {
  console.log('user connected');
  const messages = await messagesModel.getMessages();
  io.to(socket.id).emit('showMessageHistory', messages);
  const users = {};
  socket.on('userConection', (currentUser) => {
    users[socket.id] = currentUser;
    io.emit('displayUsers', users);
  });
  socket.on('changeNickname', (nickname) => {
    users[socket.id] = nickname;
    io.emit('displayUsers', users);
  });
  socket.on('message', async ({ nickname, chatMessage }) => {
    const msg = {
      nickname,
      message: chatMessage,
      timestamp: moment(new Date()).format('DD-MM-yyyy hh:mm:ss'),
    };
    const message = await messagesModel.newMessage(msg);
    io.emit('message', `${message.timestamp} - ${message.nickname}: ${message.message}`);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const { PORT } = process.env;

server.listen(PORT, () => console.log(`listening on ${PORT}`));
