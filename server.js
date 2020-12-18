require('dotenv');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const moment = require('moment');
const { insertMessages, getAllMessages } = require('./models/messageModel');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/ping', (_, res) => {
  res.status(200).json({ message: 'pong!' });
});

io.on('connection', async (socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const date = new Date();
    const timeSend = moment(date).format('DD-MM-yyyy h:mm:ss');
    const formatedMessage = `${timeSend} ${nickname}: ${chatMessage}`;
    socket.emit('message', formatedMessage);
    socket.broadcast.emit('message', formatedMessage);
    await insertMessages(chatMessage, nickname, timeSend);
  });

  const chatHistory = await getAllMessages();

  console.log('history:', chatHistory);

  chatHistory.map(({ chatMessage, nickname, timestamp }) => {
    const formatedMessage = `${timestamp} ${nickname}: ${chatMessage}`;
    console.log(formatedMessage);
    socket.emit('history', formatedMessage);
  });

});

server.listen(PORT, () => console.log(`Ouvindo a porta ${PORT}!`));
