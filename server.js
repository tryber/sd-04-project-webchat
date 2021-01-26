const express = require('express');
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
  console.log('Conectado');

  const users = {};

  socket.on('userConection', (currentUser) => {
    users[socket.id] = currentUser;
    io.emit('displayUsers', users);
  });

  socket.on('changeNickname', (nickname) => {
    users[socket.id] = nickname;
    io.emit('displayUsers', users);
  });

  socket.on('message', ({ nickname, chatMessage }) => {
    const msg = {
      nickname,
      message: chatMessage,
      timestamp: moment(new Date()).format('DD-MM-yyyy hh:mm:ss'),
    };
    io.emit('message', `${msg.timestamp} - ${nickname}: ${chatMessage}`);
  });
  socket.on('disconnect', () => {
    console.log('Desconectado');
  });
});

const PORT = 3000;

server.listen(PORT, () => console.log(`Servidor ouvindo na porta ${PORT}`));
