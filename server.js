const express = require('express');
const http = require('http');
const cors = require('cors')();
const socketIo = require('socket.io');
const path = require('path');
const moment = require('moment');
const { insertMessage, findAllMessages } = require('./models/messageModel');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const socketIoServer = http.createServer(app);
const io = socketIo(socketIoServer);

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors);

const onlineUsers = {};
const now = moment(new Date()).format('DD-MM-yyyy HH:mm:ss');

io.on('connection', async (socket) => {
  try {
    socket.on('disconnect', () => {
      delete onlineUsers[socket.id];
      io.emit('setUsers', onlineUsers);
    });
    socket.on('setNickname', (nickname) => {
      onlineUsers[socket.id] = nickname;
      io.emit('setUsers', onlineUsers);
    });
    socket.on('history', async (type) => {
      const history = await findAllMessages('messages');
      io.to(socket.id).emit('history', history, type, onlineUsers);
    });

    socket.on('message', async ({ nickname, chatMessage, receiver }) => {
      let formatedMessage;
      if (!receiver) {
        formatedMessage = await insertMessage({
          nickname,
          message: chatMessage,
          timestamp: now,
        }, 'messages');
        io.emit('message', `${formatedMessage.timestamp} - ${nickname}: ${chatMessage}`, 'public');
      } else {
        formatedMessage = await insertMessage({
          nickname,
          message: chatMessage,
          timestamp: now,
          receiver,
        }, 'private');
        io.to(socket.id)
          .to(receiver)
          .emit('message', `${now} (private) - ${nickname}: ${chatMessage}`, 'private', receiver);
      }
    });

    socket.on('error', (error) => console.error(error));
  } catch (e) {
    console.log(e);
  }
});

socketIoServer.listen(PORT, () => {
  console.log(`Servidor ouvindo a porta ${PORT}`);
});
