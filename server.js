const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const moment = require('moment');
const { insertMsg, getMsgs } = require('./models/messages');

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
  const msgs = await getMsgs();
  msgs.map(({ timestamp, nickname, message }) =>
    io.emit(
      'message',
      `${timestamp} - ${nickname}: ${message}`,
    ));

  socket.on('userConection', (currentUser) => {
    users[socket.id] = currentUser;
    console.log('newusers', users);
    io.emit('displayUsers', users);
  });

  socket.on('updateNick', (nickname) => {
    users[socket.id] = nickname;
    console.log('updateusers', users);
    io.emit('displayUsers', users);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    console.log('delusers', users);
    io.emit('displayUsers', users);
  });

  // Single Message Emitter
  socket.on('message', async ({ nickname, chatMessage }) => {
    const msg = await insertMsg({
      nickname,
      message: chatMessage,
      timestamp: moment(new Date()).format('DD-MM-yyyy hh:mm:ss'),
    });
    io.emit(
      'message',
      `${msg.timestamp} - ${nickname}: ${chatMessage}`,
    );
  });
});

server.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
