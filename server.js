const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const chatModel = require('./models/chatModel');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

let onlineUsers = [];

const loadMessages = async (socket) => {
  const messages = await chatModel.getMessages();
  socket.emit('loadMessages', messages);
};

io.on('connection', (socket) => {
  console.log('user connected');

  // handle users
  socket.on('connectedUser', (nickname) => {
    const user = { userID: socket.id, nickname };
    onlineUsers = [...onlineUsers, user];
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('saveNickname', (nickname) => {
    const userIndex = onlineUsers.findIndex(
      (user) => user.userID === socket.id,
    );
    onlineUsers[userIndex].nickname = nickname;
    io.emit('onlineUsers', onlineUsers);
  });
  //

  // handle messages
  loadMessages(socket);

  socket.on('message', async (data) => {
    const { chatMessage, nickname } = data;
    const result = await chatModel.saveMessage(chatMessage, nickname);
    const { date } = result;
    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
  });
  //

  socket.on('disconnect', () => {
    console.log('user disconnected');
    onlineUsers = onlineUsers.filter((user) => user.userID !== socket.id);
    socket.broadcast.emit('onlineUsers', onlineUsers);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
