// Server.js será como o index.js dos projetos anteriores
/*
  1 - Crie um back-end para conexão simultaneamente de clientes
e troca de mensagens em chat público
*/
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const socket_io = require('socket.io');

const app = express();
const socketIoServer = http.createServer(app);
const io = socket_io(socketIoServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.static(`${__dirname}/assets/`));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

io.on('connect', (socket) => {
  console.log('Conectado');

  socket.on('disconnect', () => {
    console.log('Desconectado');
    io.emit('adeus', { mensagem: 'Poxa, fica mais, vai ter bolo :)' });
  });

  socket.on('message', (message) => {
    const { chatMessage, nickname } = message;
    console.log(`Mensagem ${message}`);
    console.log('MESSAGE: ', nickname, chatMessage);
    io.emit('messageServer', message);
  });

  socket.broadcast.emit('messageServer');
});

socketIoServer.listen(3000, () => {
  console.log('socketIoServer - Servidor ouvindo na porta 3000');
});
