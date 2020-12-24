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

let usersOnline = [];
let counter = 0;

io.on('connection', async (socket) => {
  socket.on('online', (name) => {
    counter += 1;
    usersOnline.push({ id: socket.id, name: `${name}${counter}` });
    console.log('?', usersOnline);
    io.emit('online', usersOnline);
  });

  socket.on('saveName', ({ id, name }) => {
    console.log('save:', { id, name });
    usersOnline = usersOnline.filter((user) => user.id !== id);
    usersOnline.push({ id, name });
    console.log(usersOnline);
    io.emit('online', usersOnline);
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const date = new Date();
    const timeSend = moment(date).format('DD-MM-yyyy h:mm:ss');
    const formatedMessage = `${timeSend} ${nickname}: ${chatMessage}`;

    io.emit('message', formatedMessage);

    await insertMessages(chatMessage, nickname, timeSend);
  });

  const chatHistory = await getAllMessages();

  chatHistory.map(({ chatMessage, nickname, timestamp }) => {
    const formatedMessage = `${timestamp} ${nickname}: ${chatMessage}`;
    socket.emit('history', formatedMessage);
    return true;
  });

  socket.on('disconnect', () => {
    usersOnline = usersOnline.filter(({ id }) => id !== socket.id);
    console.log('Disconnect:', usersOnline);
    io.emit('online', usersOnline);
  });
});

server.listen(PORT, () => console.log(`Ouvindo a porta ${PORT}!`));
