const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const chatModel = require('./models/chatModel');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

const loadMessages = async (socket) => {
  const messages = await chatModel.getMessages();
  socket.emit('loadMessages', messages);
};

io.on('connection', (socket) => {
  console.log('user connected');

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
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
