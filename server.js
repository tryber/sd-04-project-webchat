const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const httpServer = http.createServer(app);

require('dotenv').config();

const io = socketIo(httpServer);

const messagesModels = require('./models/messagesModel');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'views')));

io.on('connection', async (socket) => {
  socket.on('dateUser', (dateUser) => {
    socket.server.eio.clients[socket.id].id = dateUser.nickname;
    const listIdsUsers = Object.keys(socket.server.eio.clients);
    let listNamesConverted = [];
    listIdsUsers.forEach((userId) => {
      listNamesConverted = [...listNamesConverted, {
        id: userId,
        nickname: socket.server.eio.clients[userId].id,
      }];
    });
    socket.emit('listNamesConverted', listNamesConverted);
    socket.broadcast.emit('listNamesConverted', listNamesConverted);
  });

  let message;
  socket.on('message', async (data) => {
    try {
      const addMessage = await messagesModels.add(data.nickname, data.chatMessage);
      message = `${addMessage.dateMessage} - ${addMessage.nickname}: ${addMessage.chatMessage}`;
      socket.emit('dataServer', message);
      socket.broadcast.emit('dataServer', message);
    } catch (e) {
      console.log(e.message);
    }
  });
  try {
    const messages = await messagesModels.getAll();
    messages.forEach((item) => {
      message = `${item.dateMessage} - ${item.nickname}: ${item.chatMessage}`;
      socket.emit('dataServer', message);
    });
  } catch (e) {
    console.log(e.message);
  }
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => console.log(`Escutando na porta ${PORT}`));
