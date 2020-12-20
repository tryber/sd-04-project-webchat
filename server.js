const express = require('express');
const http = require('http');
const path = require('path');
const moment = require('moment');

const app = express();

const socketIoServer = http.createServer(app);

const io = require('socket.io')(socketIoServer);
const models = require('./model/modelMessages');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', express.static(path.join(__dirname, '/public')));

io.on('connection', async (socket) => {
  const onlineUsers = [];

  const historyMessage = await models.getAllMessages();
  const msgHisto = [];
  historyMessage.map((msg) => {
    const { chatMessage, nickname, timestamp } = msg;
    return msgHisto.push(`${timestamp} - ${nickname}: ${chatMessage}`);
  });
  io.emit('Historico', msgHisto);

  socket.on('message', async ({ chatMessage, nickname }) => {
    const time = new Date();
    const timestamp = moment(time).format('DD-MM-yyyy HH:mm:ss');
    const renderMessage = `${timestamp} - ${nickname}: ${chatMessage}`;
    io.emit('message', renderMessage);

    await models.createMessage(chatMessage, nickname, timestamp);
  });

  socket.on('changeName', async ({ nickname }) => {
    io.emit('changeName', nickname);
  });

  socket.on('changeName', async ({ nickname }) => {
    onlineUsers.push(nickname);
    io.emit('online', onlineUsers);
  });

  socket.on('disconnect', () => {
    delete onlineUsers[socket.id];
    io.emit('online', onlineUsers);
  });
});

const PORT = process.env.PORT || 3000;

socketIoServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
