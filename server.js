const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const cors = require('cors');

const moment = require('moment');

const { getAllMessages, insertMessage } = require('./models/chatModel');

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.sendFile('index.html');
});

// SOCKET.IO
io.on('connection', async (socket) => {
  const allMessages = await getAllMessages();

  console.log('msgs vindas do DB', allMessages);

  socket.emit('history', allMessages);

  console.log('socket conectado com ID:', socket.id);

  socket.on('disconnect', (msg) => {
    console.log(`user ${socket.id} disconnected from server`);
    io.emit('disconnect', msg);
  });

  socket.on('message', async (message) => {
    console.log('autor da msg:', message.nickname);
    console.log('msg vinda do client', message.chatMessage);

    const timeformated = moment(new Date()).format('DD-MM-YY HH:mm:ss');
    const fullMessage = {
      nickname: message.nickname,
      chatMessage: message.chatMessage,
      timeStamp: timeformated,
    };

    await insertMessage(message.nickname, message.chatMessage, timeformated);

    io.emit('message', fullMessage);
    // socket.broadcast.emit('message', message.chatMessage);
  });
});

server.listen(3000, () => console.log('Running on Port 3000'));
