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

io.on('connection', (socket) => {
  let message;
  socket.on('message', async (data) => {
    try {
      const addMessage = await messagesModels.add(data.nickname, data.chatMessage);
      message = `${addMessage.dateMessage} ${addMessage.chatMessage} ${addMessage.nickname}`;
      socket.emit('dataServer', message);
      socket.broadcast.emit('dataServer', message);
    } catch (e) {
      console.log(e.message);
    }
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => console.log(`Escutando na porta ${PORT}`));
