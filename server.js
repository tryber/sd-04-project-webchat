const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const moment = require('moment');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const { getAllMessages, addMessage } = require('./models/message');

const PORT = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const users = [];

io.on('connection', async (socket) => {
  const allMessage = await getAllMessages();
  console.log('conected');
  console.log('allMessages', allMessage);
  socket.emit('allMessage', allMessage);
  socket.emit('users', users);

  socket.on('message', async ({ chatMessage, nickname }) => {
    console.log('chatMessage', chatMessage);
    console.log('nick', nickname);
    const timestamp = moment().format('MM-DD-YYYY h:mm a');
    console.log('time', timestamp);
    const newMsg = `${timestamp} - ${nickname}: ${chatMessage}`;
    socket.emit('message', newMsg);

    socket.broadcast.emit('message', newMsg);
    await addMessage(chatMessage, nickname, timestamp);
  });

  socket.on('changeName', () => {});
  socket.on('users', () => {});
  socket.on('disconect', () => {});
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
