require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const moment = require('moment');
const Model = require('./models/chatModel');

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Conexão
io.on('connection', async (socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const date = new Date();
    const time = moment(date).format('DD-MM-yyyy HH:mm:ss a');
    const msg = `${time} - ${nickname}: ${chatMessage}`;

    await Model.saveMessage(chatMessage, nickname, time);

    io.emit('message', msg);
    // Posso passar o socket ID para fazer uma verificação
    // de quem está online e não repetir os nomes
    io.emit('usersOnline', nickname);
  });

  const array = [];
  const history = await Model.getMessages();
  history.forEach(({ chatMessage, nickname, timestamp }) => {
    const save = `${timestamp} - ${nickname}: ${chatMessage}`;

    array.push(save);
    // console.log(array[array.length - 1])
    return array;
  });
  socket.emit('history', array);
});

server.listen(PORT, () => console.log(`Ouvindo na porta ${PORT}`));
