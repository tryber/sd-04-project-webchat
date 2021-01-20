const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const moment = require('moment');

const app = express();
const PORT = 3000;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log(
    'Conectado',
  );
  socket.on('disconnect', () => {
    console.log(
      'Desconectado',
    );
  });
  socket.on('message', ({ nickname, chatMessage }) => {
    io.emit(
      'message',
      `${moment(new Date()).format('DD-MM-yyyy hh:mm:ss A')} - ${nickname}: ${chatMessage}`,
    );
  });
});

server.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
