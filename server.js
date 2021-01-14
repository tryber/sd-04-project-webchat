const express = require('express');
const path = require('path');
const moment = require('moment');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { addMessage, getMessages } = require('./models/messagesModel');

app.use('/', express.static(path.join(__dirname, 'public')));

const online = {};

io.on('connection', async (socket) => {
  console.log(`${socket.id} conectado!`);

  online[socket.id] = socket.id;

  const history = await getMessages();

  io.emit('history', history);

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
    const userKey = getKeyByValue(online, data.privateReceiver);
    io.to(userKey).emit('new privateMessage', message);
  });

  socket.on('disconnect', () => {
    delete online[socket.id];
    io.emit('updateUsers', online);
  });
});

server.listen(3000, () => {
  console.log('Conectado!');
});
