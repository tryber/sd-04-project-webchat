const express = require('express');

const app = express();
const path = require('path');
const http = require('http');
const moment = require('moment');

const socketServer = http.createServer(app);
const io = require('socket.io')(socketServer);

const users = [];
const models = require('./models/messagesModel');

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '/public')));

io.on('connection', async (socket) => {
  const msgHistory = [];
  const callHistory = await models.getAllMessages();

  callHistory.map((msg) => {
    const { chatMessage, nickname, timestamp } = msg;
    return msgHistory.push(`${timestamp} - ${nickname}: ${chatMessage}`);
  });
  io.emit('Historico', msgHistory);

  socket.on('message', async ({ chatMessage, nickname }) => {
    const newDate = new Date();
    const timestamp = moment(newDate).format('DD-MM-yyyy HH:mm:ss');
    const newMsg = `${timestamp} - ${nickname}: ${chatMessage}`;
    io.emit('message', newMsg);

    await models.sendMessage(chatMessage, nickname, timestamp);
  });

  socket.on('newNickName', async ({ nickname }) => {
    io.emit('newNickName', nickname);
  });

  socket.on('usersOnline', async ({ nickname }) => {
    console.log('aha', users);
    users.push({ socketID: socket.id, nickname });
    console.log('depois');
    io.emit('onlineUsers', users);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('online', users);
  });
});

socketServer.listen(3000, () => console.log('Ouvindo na porta 3000'));
