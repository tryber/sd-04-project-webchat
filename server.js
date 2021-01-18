const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const moment = require('moment');
const { getAllMsg, createMsg } = require('./models/msgModel');

const app = express();
const socketIoServer = http.createServer(app); // cria o servidor
const io = socketIo(socketIoServer); // a partir daqui que escuta

const PUBLIC = path.join(__dirname, 'public');

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use(express.static(PUBLIC));

app.get('/', (_req, res) => {
  res.sendFile('index.html'); // conecta com o index.html
});

io.on('connection', async (socket) => {
  const allMsg = await getAllMsg();

  socket.on('newUser', (nick) => {
    console.log('esse é o nome atual', nick); // usuario
  });

  const msgSend = [];
  allMsg.map((element) => {
    const { chatMessage, nickname, timestamp } = element;
    return msgSend.push(`${timestamp} - ${nickname}: ${chatMessage}`);
  });

  socket.emit('history', msgSend);

  socket.on('message', async (message) => { // emite e salva mensagens
    const time = moment(new Date()).format('DD-MM-YYYY h:mm:ss a');
    const fullMsgString = `${time} - ${message.nickname}: ${message.chatMessage}`;
    await createMsg(message.chatMessage, message.nickname, time);
    io.emit('message', fullMsgString);
  });

  socket.on('newNickName', (user) => {
    console.log('o novo NICK vindo do front', user);
  });
});

socketIoServer.listen(3000, () => {
  console.log('Express ouvindo na porta 3000');
});
