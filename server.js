require('dotenv').config();

const express = require('express');
const path = require('path');

const moment = require('moment');

const app = express();
const http = require('http');

const socketIoServer = http.createServer(app);

const io = require('socket.io')(socketIoServer);
const modelMessages = require('./model/modelMessages');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', express.static(path.join(__dirname, '/public')));

let onlineUsers = [];

io.on('connection', async (socket) => {
  const history = await modelMessages.getAllMessages();

  history.forEach(({ chatMessage, nickname, timestamp }) => {
    const previousMessages = `${timestamp} ${nickname} ${chatMessage}`;
    socket.emit('history', previousMessages);
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    const formatedTimestamp = moment().format('DD-MM-yyyy HH:mm:ss');

    const message = `(${formatedTimestamp}) - ${nickname} says: ${chatMessage}`;
    io.emit('message', message);
    return modelMessages.createMessage(chatMessage, nickname, formatedTimestamp);
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

// io.on('connection', async (socket) => {
//   const historyMessage = await modelMessages.getAllMessages();
//   const msgHisto = [];
//   historyMessage.map((msg) => {
//     const { chatMessage, nickname, timestamp } = msg;
//     return msgHisto.push(`${timestamp} - ${nickname}: ${chatMessage}`);
//   });

//   io.emit('history', msgHisto);

//   socket.on('message', async ({ chatMessage, nickname }) => {
//     const time = new Date();
//     const timestamp = moment(time).format('DD-MM-yyyy HH:mm:ss');
//     const renderMessage = `${timestamp} - ${nickname}: ${chatMessage}`;
//     io.emit('message', renderMessage);

//     await modelMessages.createMessage(chatMessage, nickname, timestamp);
//   });

//   socket.on('changeName', async ({ nickname }) => {
//     io.emit('changeName', nickname);
//   });

//   socket.on('changeName', async ({ nickname }) => {
//     onlineUsers.push(nickname);
//     io.emit('online', onlineUsers);
//   });

//   socket.on('disconnect', () => {
//     delete onlineUsers[socket.id];
//     io.emit('online', onlineUsers);
//   });
// });

const PORT = process.env.PORT || 3000;

socketIoServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
