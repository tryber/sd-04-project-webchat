const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const cors = require('cors');

const { getAllMessages, insertMessage } = require('./models/chatModel');

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.sendFile('index.html');
});

io.on('connection', async (socket) => {
  const allMessages = await getAllMessages();

  console.log(allMessages);

  console.log('socket conectado com ID:', socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected from server');
  });

  socket.on('message', (message) => {
    console.log('autor da msg:', message.nickname);
    console.log('msg vinda do client', message.chatMessage);
    io.emit('message', message);
    // socket.broadcast.emit('message', message.chatMessage);
  });
});

server.listen(3000, () => console.log('Running on Port 3000'));
