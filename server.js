const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { getMessages, createMessage } = require('./models/messagesModel');

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
  const messages = await getMessages();
  io.to(socket.id).emit('displayHistory', messages, 'public');

  socket.on('userConnection', (currentUser) => {
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
  socket.on('message', async ({ nickname, chatMessage }) => {
    let message;
    if (!!nickname && !!chatMessage) {
      message = await createMessage({
        nickname,
        chatMessage,
      });
      io.emit(message);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
