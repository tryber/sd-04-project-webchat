require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors')();
const socket_io = require('socket.io')
const path = require('path');

let guestId = 0;

const socketIoServer = http.createServer(app);
const io = socket_io(socketIoServer,
  {
    cors: {
      origin: 'http://localhost:3000/',
      methods: ['GET', 'POST'],
    },
  });

const sockets = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors);
app.use('/', express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  guestId++;
  console.log('Conectado');
  socket.emit("Seja bem vindo");
  socket.broadcast.emit('mensagemServer');
  const user = `Guest${guestId}`;
  sockets.push(socket);
  io.emit('listing',{user});

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

socketIoServer.listen(process.env.PORT, () => {
  console.log(`Servidor ouvindo a porta ${process.env.PORT}`);
});
