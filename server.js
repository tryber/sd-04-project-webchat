const express = require('express');
const messageModels = require('./models/messageModel');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
const path = require('path');

const loggedUsers = {};
app.use(cors());


app.use(express.static(path.join(__dirname, 'public')));


// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', (socket) => {
  loggedUsers[socket.id] = socket.id;
  io.emit('loggedUsers', loggedUsers);

  socket.on('disconnect', () => {
    delete loggedUsers[socket.id];
    io.emit('loggedUsers', loggedUsers);
  });

  socket.on('send all messages', async () => {
    let allMessages = await messageModels.getAllMessages();
    io.emit('allMessages', allMessages);
  });

  socket.on('message', async (msg) => {
    const result = await messageModels.storeMessage(msg.nickname, msg.text);
    console.log('result', result);
    io.emit('message', result);
  });

  socket.on('nicknameChange', (nicknameChangePayload) => {
    const { socketId, nickname } = nicknameChangePayload;
    loggedUsers[socketId] = nickname;
    io.emit('loggedUsers', loggedUsers);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
