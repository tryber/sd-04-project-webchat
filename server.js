const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const path = require('path');
const moment = require('moment');
const { getAllMsg, createMsg, getPrivateMessages, createPrivateMsg } = require('./models/msgModel');

const app = express();
const socketIoServer = http.createServer(app); // cria o servidor
const io = socketIo(socketIoServer); // a partir daqui que escuta

const PUBLIC = path.join(__dirname, 'public');

app.use(express.static(PUBLIC));

app.get('/', (_req, res) => {
  res.sendFile('index.html'); // conecta com o index.html
});

const onlineUsers = {};

io.on('connection', async (socket) => {
  console.log(`${socket.id} conectado!`);

  onlineUsers[socket.id] = socket.id;

  const history = await getAllMsg();

  io.emit('history', history);

  socket.on('newHistory', async () => {
    const newHistory = await getAllMsg();
    socket.emit('renderNewHistory', newHistory);
  });

  const privateHistory = await getPrivateMessages();

  io.emit('privateHistory', privateHistory);

  socket.on('privateHistory', async (selectedUser) => {
    const newPrivateHistory = await getPrivateMessages();
    socket.emit('renderPrivateHistory', { newPrivateHistory, selectedUser });
  });

  socket.emit('newUser', socket.id);

  socket.on('chosenNick', (data) => {
    onlineUsers[socket.id] = data;
    io.emit('updateUsers', onlineUsers);
  });

  io.emit('updateUsers', onlineUsers);

  socket.on('message', async (data) => {
    const dateTime = new Date().getTime();
    const dateToUser = moment(dateTime).format('DD-MM-yyyy h:mm:ss A');
    const message = `${dateToUser} - ${data.nickname}: ${data.chatMessage}`;
    await createMsg(data.nickname, data.chatMessage, dateTime);
    io.emit('message', message);
  });

  function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }
  socket.on('privateMessage', (data) => {
    const dateTime = moment(new Date()).format('DD-MM-yyyy h:mm:ss A');
    const message = `${dateTime} (private) - ${data.nickname}: ${data.chatMessage}`;
    const sender = getKeyByValue(onlineUsers, data.nickname);
    const receiver = getKeyByValue(onlineUsers, data.privateReceiver);
    createPrivateMsg(data.nickname, data.chatMessage, dateTime);
    io.to(sender).emit('new privateMessageSender', message);
    io.to(receiver).emit('new privateMessage', message);
  });

  socket.on('disconnect', () => {
    delete onlineUsers[socket.id];
    io.emit('updateUsers', onlineUsers);
  });
});

socketIoServer.listen(3000, () => {
  console.log('Ouvindo!');
});
