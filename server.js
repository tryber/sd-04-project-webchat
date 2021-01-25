const express = require('express');
const http = require('http');
const cors = require('cors')();
const socketIo = require('socket.io');
const path = require('path');
const { insertMessage, findAllMessages } = require('./models/messageModel');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const socketIoServer = http.createServer(app);
const io = socketIo(socketIoServer);

const onlineUsers = {};

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors);

io.on('connection', async (socket) => {
  const history = await findAllMessages();
  socket.emit('setHistory', history);

  let user = `Guest-${socket.id}`;

  socket.emit('setName', user);
  const setUsers = (user, onlineUsers, deleteUser) => {
    if (!deleteUser) {
      onlineUsers[socket.id] = user;
    }
    io.emit('onlineUsers', onlineUsers);
  }
  setUsers(user, onlineUsers)
  socket.on('setName', (userParam) => {
    user = userParam;
    setUsers(user, onlineUsers)
  });

  socket.broadcast.emit('connectMessage', `${user} está online!`);

  socket.on('disconnect', () => {
    socket.broadcast.emit('disconnectMessage', `${user} saiu!`);
    delete onlineUsers[socket.id];
    setUsers(null, onlineUsers, true)
  });

  socket.on('mensagem', async (message) => {
    const formatedMessage = await insertMessage(message, user);
    io.emit('menssage', formatedMessage);
  });
  
  socket.on('error', (error) => console.error(error))
});

socketIoServer.listen(PORT, () => {
  console.log(`Servidor ouvindo a porta ${PORT}`);
});
