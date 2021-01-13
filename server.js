const express = require('express');
const path = require('path');
const moment = require('moment');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { addMessage, getMessages } = require('./models/messagesModel');

app.use('/', express.static(path.join(__dirname, 'public')));

const user = {};

io.on('connection', async (socket) => {
  console.log(`${socket.id} conectado!`);

  const history = await getMessages();

  io.emit('history', history);

  socket.emit('newUser', socket.id);

  socket.on('chosenNick', (data) => {
    user[socket.id] = data;
  });

  socket.on('message', async (data) => {
    const dateTime = new Date().getTime();
    const dateToUser = moment(dateTime).format('DD-MM-yyyy h:mm:ss A');
    const message = `${dateToUser} - ${data.nickname}: ${data.chatMessage}`;
    await addMessage(data.nickname, data.chatMessage, dateTime);
    io.emit('message', message);
  });
});

server.listen(3000, () => {
  console.log('Conectado!');
});
