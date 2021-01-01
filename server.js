const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const socketIoServer = http.createServer();
const io = require('socket.io')(server);

// importar o model abaixo, o model traz as funçoes para salvar e mostrar as msgs
// const { newMessage, saveAllMessages } = require('./model/modelMsg');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'public')));

// formatar a data, pegando a dica no site da Trybe
const data = new Date();
const timestamp =
  data.getDate() +
  '-' +
  (data.getMonth() + 1) +
  '-' +
  data.getFullYear() +
  ' ' +
  data.getHours() +
  ':' +
  data.getMinutes() +
  ':' +
  data.getSeconds();

// criar uma rota de notificação
app.post('/notify', (req, res) => {
  const { title, msg } = req.body;

  if (!title || !msg) {
    return res.status(422).json({ message: 'Missing not title || msg !' });
  }

  io.emit('notification', { title, msg });
  return res.status(200).json({ message: 'Notification emitted!' });
});

app.get('/ping', (_, res) => {
  res.status(200).json({ message: 'pong' });
});

app.listen(3000);
console.log('Express rodando na porta 3000');

socketIoServer.listen(4555);
console.log('Socket.io rondando na porta 4555');
console.log(timestamp);
