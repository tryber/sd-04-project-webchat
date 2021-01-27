const express = require('express');
require('dotenv').config();
const http = require('http');
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

io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('message', ({ nickname, chatMessage }) => {
    const msg = {
      nickname,
      message: chatMessage,
      timestamp: moment(new Date()).format('DD-MM-yyyy hh:mm:ss'),
    };
    io.emit('message', `${msg.timestamp} - ${nickname}: ${chatMessage}`, 'publick ');
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const { PORT } = process.env;

server.listen(PORT, () => console.log(`listening on ${PORT}`));
