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

let clients = [];

io.on('connection', async (socket) => {
  // Traz todas mensagens do banco de dados e envia para o front
  const history = await getAll();
  io.emit('history', history);

  // Escuta a entrada do nickname assim que inicia a conexão
  socket.on('nickname', (nickname) => {
    clients.filter((client) => socket.id !== client.id);
    clients.push({ id: socket.id, nickname });
    socket.emit('nickname', nickname);
    io.emit('online-users', clients);
  });

  // Escuta a mensagem vinda do FRONT e armazena no banco de dados,
  //  e retorna para o FRONT a msg formatada.
  socket.on('message', async ({ chatMessage, nickname }) => {
    const newDate = new Date();
    const date = moment(newDate).format('DD-MM-yyyy HH:mm:ss');
    const msg = `${date} - ${nickname}: ${chatMessage}`;
    io.emit('message', msg);
    const obj = {
      chatMessage,
      nickname,
      timestamp: date,
    };
    await save(obj);
  });

  socket.on('logged', ({ nickname }) => {
    const obj = { id: socket.id, nickname };
    clients.push(obj);
    io.emit('online-users', clients);
  });

  // Usuario foi desconectado
  socket.on('disconnect', (nickname) => {
    clients.filter((client) => client !== nickname);
    clients = [];
    io.emit('online-users', clients);
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
