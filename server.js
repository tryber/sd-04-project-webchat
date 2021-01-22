const express = require('express');
const http = require('http');
const cors = require('cors')();
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
let guestId = 0;

const socketIoServer = http.createServer(app);
const io = socketIo(socketIoServer);

const sockets = [];

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors);

io.on('connection', (socket) => {
  guestId += 1;
  console.log('Conectado');
  socket.emit('Seja bem vindo');
  socket.broadcast.emit('mensagemServer');

  let user = `Guest${guestId}`;

  sockets.push(socket);

  io.emit('getName', { user });

  socket.on('setName', (userParam) => {
    user = userParam
  })

  socket.on('disconnect', () => {
    io.emit('adeus', { mensagem: 'Poxa, fica mais, vai ter bolo :)' });
    sockets.splice(sockets.indexOf(socket), 1);
  });

  socket.on('mensagem', (message) => {
    io.emit('menssage', `${user} disse: ${message}`);
  });

  socket.on('error', (error) => {
    console.error('Erro no socket: ', error.message);
  });
});

socketIoServer.listen(PORT, () => {
  console.log(`Servidor ouvindo a porta ${PORT}`);
});
