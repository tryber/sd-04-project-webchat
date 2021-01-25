const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const moment = require('moment');
const { createMessage, createPrivateMessage, getMessages } = require('./models/messagesModel');

const app = express();
const PORT = 3000;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'public')));

const users = {};

io.on('connection', async (socket) => {
  // Load Message History
  const msgs = await getMessages();
  // const pvtMsgs = await getPvtMsgs();
  io.to(socket.id).emit('displayHistory', msgs, 'public');
  // io.to(socket.id).emit('displayHistory', pvtMsgs, 'private');

  socket.on('userConection', (currentUser) => {
    users[socket.id] = currentUser;
    io.emit('displayUsers', users);
  });

  socket.on('updateNick', (nickname) => {
    users[socket.id] = nickname;
    io.emit('displayUsers', users);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('displayUsers', users);
  });

  // Single Message Emitter
  socket.on('message', async ({ nickname, chatMessage, receiver }) => {
    let msg;
    if (!receiver) {
      msg = await createMessage({
        nickname,
        message: chatMessage,
        timestamp: moment(new Date()).format('DD-MM-yyyy hh:mm:ss'),
      });
      io.emit(
        'message',
        `${msg.timestamp} - ${nickname}: ${chatMessage}`,
        'public',
      );
    } else {
      msg = await createPrivateMessage({
        nickname,
        message: chatMessage,
        timestamp: moment(new Date()).format('DD-MM-yyyy hh:mm:ss'),
        receiver,
      });
      io.to(socket.id).to(receiver).emit(
        'message',
        `${msg.timestamp} (private) - ${nickname}: ${chatMessage}`,
        'private',
      );
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
