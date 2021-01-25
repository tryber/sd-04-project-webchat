const express = require('express');
const http = require('http');
const cors = require('cors')();
const socketIo = require('socket.io');
const path = require('path');
const formatMessage = require('./utils/formatMessage');
const { insertMessage, findAllMessages } = require('./models/messageModel');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
let guestId = 0;

const socketIoServer = http.createServer(app);
const io = socketIo(socketIoServer);

const sockets = [];
const onlineUsers = {};

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors);

io.on('connection', async (socket) => {
  guestId += 1;
  let user = `Guest${guestId}`;
  const history = await findAllMessages();
  io.emit('getName', { user });
  io.emit('setHistory', history);

  socket.on('setName', (userParam) => {
    user = userParam;
  });

  onlineUsers[socket.id] = user;
  socket.broadcast.emit('connectMessage', `${user} está online!`);

  socket.on('disconnect', () => {
    socket.broadcast.emit('disconnectMessage', `${user} saiu!`);
    sockets.splice(sockets.indexOf(socket), 1);
    delete onlineUsers[socket.id];
  });
  io.emit('onlineUsers', onlineUsers);

  socket.on('mensagem', async (message) => {
    const formatedMessage = formatMessage(user, message);
    io.emit('menssage', formatedMessage);
    await insertMessage(formatMessage);
  });
});

socketIoServer.listen(PORT, () => {
  console.log(`Servidor ouvindo a porta ${PORT}`);
});
