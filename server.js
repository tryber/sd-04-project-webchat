require('dotenv').config();

const express = require('express');
const path = require('path');

//  Moment retirado de https://tableless.com.br/trabalhando-com-moment/
const moment = require('moment');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const webchatModel = require('./models/webchatModel');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', express.static(path.join(__dirname, 'public')));

let onlineUsers = [];

io.on('connection', async (socket) => {
  console.log('usuário se contectou');

  const history = await webchatModel.getHistory();

  history.forEach(({ chatMessage, nickname, timestamp }) => {
    const previousMessages = `${timestamp} ${nickname} ${chatMessage}`;
    socket.emit('history', previousMessages);
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    const formatedTimestamp = moment().format('DD-MM-yyyy HH:mm:ss');

    const message = `(${formatedTimestamp}) - ${nickname} says: ${chatMessage}`;
    io.emit('message', message);
    return webchatModel.saveMessages(chatMessage, nickname, formatedTimestamp);
  });

  socket.on('usersOnline', ({ nickname }) => {
    onlineUsers.push({ socketId: socket.id, nickname });
    io.emit('usersOnlineUpdate', onlineUsers);
  });

  socket.on('updateNickname', ({ newName }) => {
    console.log(onlineUsers);
    onlineUsers = onlineUsers.filter(({ nickname }) => nickname !== newName);
    console.log(onlineUsers);
    onlineUsers.push({ socketId: socket.id, nickname: newName });
    io.emit('usersOnlineUpdate', onlineUsers);
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(({ socketId }) => socketId !== socket.id);
    io.emit('usersOnlineUpdate', onlineUsers);
  });
});

const { PORT } = process.env;
http.listen(PORT, () => {
  console.log(`Ouvindo na porta ${PORT}`);
});
