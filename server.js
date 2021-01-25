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
const ls = require('local-storage');

io.on('connect', async (socket) => {
  console.log('Conectado');
  console.log('id', socket.id);
  
  const previousMessage = await messagesModel.all();
  io.emit('previousMessage', previousMessage);

  const randomNick = `Guest_${socket.id}`;

  clients.push({ userId: socket.id, nickname: randomNick });


  io.emit('join', clients, randomNick, socket.id);
  io.emit('listNicknameServer', randomNick, socket.id);

  socket.on('disconnect', () => {
    clients = clients.filter((client) => client.userId !== socket.id);
    io.emit('exit', socket.id);
  });

  socket.on('message', async (message) => {
    const { chatMessage, nickname } = message;
    const timestamp = new Date();
    const dateMessage = `${timestamp.getDate()}-${timestamp.getMonth() + 1}-${timestamp.getFullYear()}`;
    const timeMessage = `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`;
    const formatedMessage = `${dateMessage} ${timeMessage} - ${nickname}: ${chatMessage}`;

    const add = await messagesModel.create(nickname, formatedMessage, timeMessage);
    io.emit('message', formatedMessage);
  });

  socket.on('publicChat', async () => {
    const previousMessages = await messagesModel.all();
    socket.emit('previousMessage', previousMessages);
  });

  socket.on('privateMessage', (message) => {
    const { chatMessage, nickname, receiver } = message;
    const timestamp = new Date();
    const dateMessage = `${timestamp.getDate()}-${timestamp.getMonth() + 1}-${timestamp.getFullYear()}`;
    const timeMessage = `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`;
    const formatedMessage = `${dateMessage} ${timeMessage} (private) - ${nickname}: ${chatMessage}`;
    socket.to(receiver).emit('privateMessage', formatedMessage);
    socket.emit('privateMessage', formatedMessage);

    io.emit('privateMessage', formatedMessage);
  });

  socket.on('changeNickname', (nickname) => {
    clients = clients.map((client) => {
      if (client.userId === socket.id) {
        const NewNick = client;
        NewNick.nickname = nickname;
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
