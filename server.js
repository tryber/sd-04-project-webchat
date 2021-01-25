const express = require('express');

const app = express();
const socketIoServer = require('http').createServer(app);
const io = require('socket.io')(socketIoServer);
const cors = require('cors');
const path = require('path');
const moment = require('moment');
const { getMessages, createMessage } = require('./models/messagesModel');

const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;
const SOCKET_IO_PORT = process.env.SOCKET_IO_PORT || 3333;

app.use(express.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'public')));

const loggedUsers = {};

io.on('connection', async (socket) => {
  loggedUsers[socket.id] = socket.id;

  const messages = await getMessages();

  io.to(socket.id).emit('displayHistory', messages, 'public');

  io.emit('displayUsers', loggedUsers);

  socket.on('userConnection', (currentUser) => {
    loggedUsers[socket.id] = currentUser;
    io.emit('displayUsers', loggedUsers);
  });

  socket.on('updateNick', (nickname) => {
    loggedUsers[socket.id] = nickname;
    io.emit('displayUsers', loggedUsers);
  });

  socket.on('disconnect', () => {
    delete loggedUsers[socket.id];
    io.emit('displayUsers', loggedUsers);
  });

  socket.on('message', async ({ nickname, chatMessage, receiver }) => {
    let msg;
    if (!receiver) {
      msg = await createMessage({
        nickname,
        message: chatMessage,
        timestamp: moment(new Date()).format('DD-MM-yyyy hh:mm:ss'),
      });
      io.emit('message', `${msg.timestamp} - ${nickname}: ${chatMessage}`, 'public');
    } else {
      // msg = await insertPvtMsg({
      //   nickname,
      //   message: chatMessage,
      //   timestamp: moment(new Date()).format('DD-MM-yyyy hh:mm:ss'),
      //   receiver,
      // });
      // io.to(socket.id)
      //   .to(receiver)
      //   .emit('message', `${msg.timestamp} (private) - ${nickname}: ${chatMessage}`, 'private');
    }
  });
});

app.listen(EXPRESS_PORT, console.log(`Express listening at port: ${EXPRESS_PORT}`));

socketIoServer.listen(
  SOCKET_IO_PORT,
  console.log(`Socket.io listening at port: ${SOCKET_IO_PORT}`),
);
