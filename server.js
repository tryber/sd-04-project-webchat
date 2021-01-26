const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const moment = require('moment');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const { getAllMessages, getallPrivateMessages, addPrivateMessage, addMessage } = require('./models/message');

const PORT = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

let users = [];

// comeca uma coneccao
io.on('connection', async (socket) => {
  // chama as msg no banco e transmite pro usuario
  const allMessage = await getAllMessages();
  socket.emit('allMessage', allMessage);

  // escuta a 'message' vinda do usuario
  socket.on('message', async ({ chatMessage, nickname }) => {
    // formata a msg
    const timestamp = moment().format('MM-DD-YYYY h:mm a');
    const newMsg = `${timestamp} - ${nickname}: ${chatMessage}`;
    // transmite a msg pra todos os usuarios
    io.emit('message', newMsg);

    // salva a msg no banco de dados
    await addMessage(chatMessage, nickname, timestamp);
  });

  // escuta o 'Nickname' vindo do usuario responsavel pela troca de nome
  socket.on('Nickname', ({ newNick }) => {
    const { old, newN } = newNick;
    const newList = users.filter((user) => user.nickname !== old);
    const newUser = {
      nickname: newN,
      id: socket.id,
    };
    newList.push(newUser);
    users = newList;
    io.emit('users', users);
  });

  // escuta o 'initialUser' do usuario que 'seta' o nome randon
  socket.on('initialUser', (nickname) => {
    const { id } = socket;
    const userObj = {
      nickname,
      id,
    };
    users.push(userObj);

    io.emit('users', users);
  });

  socket.on('allPrivate', () => {
    const allPrivate = await getallPrivateMessages();
    socket.emit('allPrivate', allPrivate);    
  })

  socket.on('privateMsg', ({ chatMessage, nickname, reciver }) => {

    const timestamp = moment().format('MM-DD-YYYY h:mm a');
    const newMsg = `${timestamp} (private) - ${nickname}: ${chatMessage}`;
    await addPrivateMessage(chatMessage, nickname, timestamp, reciver);

    socket.to(reciver).emit('privateMsg', newMsg);
    // socket.emit('privateMsg', newMsg);
    // io.emit('privateMsg', newMsg);
  })

  // desconecta o usuario e tira o nome da lista de usuarios
  socket.on('disconnect', () => {
    const newList = users.filter((user) => user.id !== socket.id);
    users = newList;
    io.emit('users', users);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
