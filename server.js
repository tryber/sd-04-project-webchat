require('dotenv').config();

const moment = require('moment');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const express = require('express');

const { save, getAll } = require('./models/messages');

const app = express();

const server = http.createServer(app);
const io = socketIo(server);

app.use('/', express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

let guestId = 0;
const clients = [];

io.on('connection', async (socket) => {
  // Traz todas mensagens do banco de dados e envia para o front
  const history = await getAll();
  io.emit('history', history);

  // Escuta a entrada do nickname assim que inicia a conexão
  socket.on('nickname', (nickname) => {
    socket.user = nickname;
    clients.push(socket);
    io.emit('nickname', nickname);
  });

  // Escuta a mensagem vinda do FRONT e armazena no banco de dados, e retorna para o FRONT a msg formatada.
  socket.on('message', async ({ chatMessage, nickname }) => {
    const newDate = new Date();
    const date = moment(newDate).format('DD-MM-yyyy HH:mm:ss');
    const msg = `${date} - ${nickname}: ${chatMessage}`;
    io.emit('message', msg);
    console.log(msg);
    const obj = {
      chatMessage,
      nickname,
      timestamp: date,
    };
    await save(obj);
  });

  // Usuario foi desconectado
  socket.on('disconnect', (nickname) => {
    clients.splice(clients.indexOf(nickname), 1);
    io.emit('message', `${nickname} deixou chat :'(`);
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
