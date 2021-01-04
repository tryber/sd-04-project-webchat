const express = require('express');
const path = require('path');
const moment = require('moment');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

const { getAllMessages, createMessage } = require('./models/messageModel');

const PORT = 3000;
let usersOnline = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', (_req, res) => res.sendFile(`${__dirname}/index.html`));

io.on('connection', async (socket) => {
  const previousMessage = await getAllMessages();

  previousMessage.forEach(({ chatMessage, timestamp, nickname }) => {
    const messageToSend = `${nickname} ${timestamp} ${chatMessage}`;
    socket.emit('history', messageToSend);
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    const time = new Date();
    const timestamp = moment(time).format('DD-MM-yyyy HH:mm:ss');
    const messages = `${nickname} ${timestamp} ${chatMessage}`;

    io.emit('message', messages);

    return createMessage(chatMessage, nickname, timestamp);
  });

  socket.on('user-login', ({ nickname }) => {
    usersOnline.push({ socketId: socket.id, nickname });
    io.emit('update-users', usersOnline);
  });

  socket.on('name-change', ({ newNickname }) => {
    usersOnline = usersOnline.filter(({ nickname }) => nickname !== newNickname);
    usersOnline.push({ socketId: socket.id, nickname: newNickname });
    io.emit('update-users', usersOnline);
  });

  socket.on('disconnect', () => {
    usersOnline = usersOnline.filter(({ socketId }) => socketId !== socket.id);
    io.emit('update-users', usersOnline);
  });
});

httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
