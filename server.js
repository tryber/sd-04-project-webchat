// Server.js será como o index.js dos projetos anteriores

const express = require('express');

const app = express();
const http = require('http');

const socketIo = require('socket.io');

const socketIoServer = http.createServer(app);

const cors = require('cors');
const path = require('path');

const messagesModel = require('./models/messagesModel');

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

let clients = [];

io.on('connect', async (socket) => {
  console.log('Conectado');

  // histórico de mensagens
  const previousMessage = await messagesModel.getAll();
  // console.log('PREVIOUSMESSAGE: ', previousMessage);
  io.emit('previousMessage', previousMessage);

  // Random nickname
  const randomNick = `Guest_${socket.id}`;
  // const randomNick = '';

  clients.push({ userId: socket.id, nickname: randomNick });
  console.log('CLIENTES: ', clients);

  // console.log('RandomNick: ', randomNick);

  io.emit('join', clients, randomNick, socket.id);
  io.emit('listNicknameServer', randomNick, socket.id);

  socket.on('disconnect', () => {
    console.log('Desconectado: ', socket.id);
    clients = clients.filter((client) => client.userId !== socket.id);
    io.emit('exit', socket.id);
  });

  socket.on('message', async (message) => {
    const { chatMessage, nickname } = message;
    const timestamp = new Date();
    // DD-MM-yyyy
    const dateMessage = `${timestamp.getDate()}-${timestamp.getMonth() + 1}-${timestamp.getFullYear()}`;
    // HH:mm:ss
    const timeMessage = `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`;
    // DD-MM-yyyy HH:mm:ss - nickname: chatMessage
    const formatedMessage = `${dateMessage} ${timeMessage} - ${nickname}: ${chatMessage}`;

    // console.log(`Mensagem ${message}`);
    // console.log('MESSAGE: ', nickname, chatMessage);
    // console.log('FORMATEDMESSAGE: ', formatedMessage);

    // Adiciona a mensagem no banco de dados.
    const add = await messagesModel.add(nickname, formatedMessage, timeMessage);
    console.log('ADD: ', add);
    io.emit('message', formatedMessage);
  });

  // private message
  // anotherSocketId -> destinatário (receiver)
  socket.on('privateMessage', (receiver, msg) => {
    socket.to(receiver).emit('privateMessage', socket.id, msg);
    // socket.to(receiver).emit('privateMessage', msg);
  });
  // --- private message ---

  socket.on('changeNickname', (nickname) => {
    clients = clients.map((client) => {
      if (client.userId === socket.id) {
        const clientNewNick = client;
        clientNewNick.nickname = nickname;
      }
      return client;
    });
    io.emit('listNicknameServer', nickname, socket.id);
  });

  socket.broadcast.emit('listNicknameServer');
});

socketIoServer.listen(3000, () => {
  console.log('socketIoServer - Servidor ouvindo na porta 3000');
});
