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
  const user = `Guest${guestId}`;
  sockets.push(socket);
  io.emit('listing', { user });

  socket.on('disconnect', () => {
    io.emit('adeus', { mensagem: 'Poxa, fica mais, vai ter bolo :)' });
    sockets.splice(sockets.indexOf(socket), 1);
    console.log('Adeus');
  });

  socket.on('mensagem', (message) => {
    io.emit('menssage', `${socket.user} disse: ${message}`);
    console.log(`Mensagem: ${message}`);
  });

  socket.on('error', (error) => {
    console.error('Erro no socket: ', error.message);
  });
});

socketIoServer.listen(PORT, () => {
  console.log(`Servidor ouvindo a porta ${PORT}`);
});
