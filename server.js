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
    clients.push(nickname);
  });

  // socket.emit('Bem vindo ao chat!\n');
  // console.log(clients);

  socket.on('message', async ({ chatMessage, nickname }) => {
    const newDate = new Date();
    const date = moment(newDate).format('DD-MM-yyyy HH:mm:ss');
    const msg = `${date} - ${nickname}: ${chatMessage}`;
    io.emit('message', msg);
    console.log(msg);
    await save(msg);
  });

  socket.on('disconnect', (client) => {
    clients.splice(clients.indexOf(client), 1);
    io.emit('message', `${socket.user} deixou chat :'(`);
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
