require('dotenv').config();
const express = require('express');
const path = require('path');
const moment = require('moment');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { PORT } = process.env;

const {
  addMessage,
  getMessages,
  addPrivateMessage,
  getPrivateMessages,
} = require('./models/messagesModel');

app.use('/', express.static(path.join(__dirname, 'public')));

const online = {};

io.on('connection', async (socket) => {
  online[socket.id] = socket.id;

  const history = await getMessages();

  io.emit('history', history);

  socket.on('newHistory', async () => {
    const newHistory = await getMessages();
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
    online[socket.id] = data;
    io.emit('updateUsers', online);
  });

  io.emit('updateUsers', online);

  socket.on('message', async (data) => {
    const dateTime = new Date().getTime();
    const dateToUser = moment(dateTime).format('DD-MM-yyyy h:mm:ss A');
    const message = `${dateToUser} - ${data.nickname}: ${data.chatMessage}`;
    await addMessage(data.nickname, data.chatMessage, dateTime);
    io.emit('message', message);
  });

  function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }
  socket.on('privateMessage', (data) => {
    const dateTime = moment(new Date()).format('DD-MM-yyyy h:mm:ss A');
    const message = `${dateTime} (private) - ${data.nickname}: ${data.chatMessage}`;
    const sender = getKeyByValue(online, data.nickname);
    const receiver = getKeyByValue(online, data.privateReceiver);
    addPrivateMessage(data.nickname, data.chatMessage, dateTime);
    io.to(sender).emit('new privateMessageSender', message);
    io.to(receiver).emit('new privateMessage', message);
  });

  socket.on('disconnect', () => {
    delete online[socket.id];
    io.emit('updateUsers', online);
  });
});

server.listen(PORT, () => {
  console.log('Conectado!');
});
