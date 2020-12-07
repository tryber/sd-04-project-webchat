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

let newUsers = [];
// SOCKET.IO
io.on('connection', async (socket) => {
  const allMessages = await getAllMessages();

  newUsers.push(socket.id);

  socket.emit('newUser', socket.id);

  socket.broadcast.emit('newUser', `User joined with ID: ${socket.id}`);

  socket.emit('history', allMessages);

  console.log('socket conectado com ID:', socket.id);
  console.log('array de novos usuários', newUsers);

  socket.on('disconnect', (msg) => {
    console.log(`user ${socket.id} disconnected from server`);
    newUsers = newUsers.filter((user) => user !== socket.id);
    console.log(newUsers);
    console.log('msg do front:', msg);
  });

  socket.on('userDisconnected', (msg) => {
    console.log('essa msg sim está vindo front-end, espero q seja o nome do usuario', msg);
  });

  socket.on('message', async (message) => {
    console.log('autor da msg:', message.nickname);
    console.log('msg vinda do client', message.chatMessage);

    const timeformated = moment(new Date()).format('DD-MM-YYYY h:mm:ss a');

    const fullMessage = {
      nickname: message.nickname,
      chatMessage: message.chatMessage,
      timeStamp: timeformated,
    };
    const fullMsgString = `${timeformated} ${message.nickname} ${message.chatMessage}`;

    await insertMessage(message.nickname, message.chatMessage, timeformated);

    io.emit('message', fullMsgString);
    // io.emit('message', fullMessage);
    // socket.broadcast.emit('message', message.chatMessage);
  });
});

server.listen(3000, () => console.log('Running on Port 3000'));
