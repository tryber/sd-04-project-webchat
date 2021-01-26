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


app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors);

const onlineUsers = {};

io.on('connection', async (socket) => {
  const history = await findAllMessages();
  socket.emit('setHistory', history);
  io.to(socket.id).emit('setHistory', history, 'public');

  let user = socket.id;

  const setUsers = (newNickname, deleteUser) => {
    if (!deleteUser) {
      onlineUsers[socket.id] = newNickname;
    }
    io.emit('setUsers', onlineUsers);
  };
  setUsers(user, onlineUsers);
  socket.on('setName', (userParam) => {
    user = userParam;
    setUsers(user);
  });

  socket.broadcast.emit('connectMessage', `${user} está online!`);


  socket.on('message', async (message) => {
    const formatedMessage = await insertMessage(message, user);
    io.emit('menssage', formatedMessage);
  });

  socket.on('disconnect', async () => {
    delete onlineUsers[socket.id];
    io.emit('setUsers', onlineUsers);
  });

  socket.on('error', (error) => console.error(error));
});

socketIoServer.listen(PORT, () => {
  console.log(`Servidor ouvindo a porta ${PORT}`);
});
