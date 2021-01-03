// Server.js será como o index.js dos projetos anteriores
/*
  1 - Crie um back-end para conexão simultaneamente de clientes
e troca de mensagens em chat público
*/
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const socketIo = require('socket.io');

const messagesModel = require('./models/messagesModel');

const app = express();
const socketIoServer = http.createServer(app);
const io = socketIo(socketIoServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/assets', express.static(`${__dirname}/assets/`));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

// Para ficar mais fácil de ler o código,
// pense no 'socket' como um 'client'.
io.on('connect', async (socket) => {
  console.log('Conectado');

  // histórico de mensagens
  const previousMessage = await messagesModel.getAll();
  console.log('PREVIOUSMESSAGE: ', previousMessage);
  io.emit('previousMessage', previousMessage);

  // Random nickname
  // const randomNick = `Guest_${socket.id}`;
  const randomNick = ''; 
  console.log('RandomNick: ',randomNick);
  io.emit('join', randomNick, socket.id);
  io.emit('listNicknameServer', randomNick, socket.id);

  socket.on('disconnect', () => {
    console.log('Desconectado');
    console.log('Desconectado: ', socket.id);
    io.emit('exit', socket.id);
  });

  // socket.on('previousMessage', (previousMessage) => {});

  socket.on('message', async (message) => {
    const { chatMessage, nickname } = message;
    const timestamp = new Date();
    // DD-MM-yyyy
    const dateMessage = `${timestamp.getDate()}-${timestamp.getMonth() + 1}-${timestamp.getFullYear()}`;
    // HH:mm:ss
    const timeMessage = `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`;
    // DD-MM-yyyy HH:mm:ss - nickname: chatMessage
    const formatedMessage = `${dateMessage} ${timeMessage}-${nickname}: ${chatMessage}`;

    console.log(`Mensagem ${message}`);
    console.log('MESSAGE: ', nickname, chatMessage);
    console.log('FORMATEDMESSAGE: ', formatedMessage);

    // Adiciona a mensagem no banco de dados.
    const add = await messagesModel.add(nickname, formatedMessage, timeMessage);
    console.log('ADD: ', add);
    io.emit('messageServer', formatedMessage);
  });

  socket.on('changeNickname', (nickname) => {
    io.emit('listNicknameServer', nickname, socket.id);
  });

  socket.broadcast.emit('listNicknameServer');
  socket.broadcast.emit('messageServer');

  // console.log('----- SOCKET -----');
  // console.log(socket);
  // console.log('----- // -----');
});

socketIoServer.listen(3000, () => {
  console.log('socketIoServer - Servidor ouvindo na porta 3000');
});
