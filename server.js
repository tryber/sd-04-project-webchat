require('dotenv');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

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
  });
});

app.listen(3001, () => console.log('Ouvindo a porta 3001!'));

server.listen(3000, () => console.log('Ouvindo a porta 3000!'));
