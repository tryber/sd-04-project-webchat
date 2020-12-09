const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const formatMessage = require('./utils/messages');
const messageModel = require('./models/messageModel');
const router = require('./router');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const loadMessagesHistory = async (socket) => {
  const messages = await messageModel.getAllMessages();
  const messageId = '_id';
  const formatedMessages = messages.map((message) => {
    const messageTimestamp = ObjectID(message[messageId]).getTimestamp();

    return formatMessage(message.nickname, message.message, messageTimestamp);
  });

  socket.emit('loadMessagesHistory', formatedMessages);
};

let userList = [];

io.on('connection', async (socket) => {
  await loadMessagesHistory(socket);

  socket.on('message', async (message) => {
    const messageId = '_id';
    const insertedMessage = await messageModel.insertMessage({
      nickname: message.nickname,
      message: message.chatMessage,
    });
    const messageTimestamp = ObjectID(
      insertedMessage[messageId],
    ).getTimestamp();
    io.emit(
      'message',
      formatMessage(message.nickname, message.chatMessage, messageTimestamp),
    );
  });

  socket.on('userOnline', (nickname) => {
    userList.push({ userId: socket.id, nickname });
    io.emit('userList', userList);
    console.log(userList);
  });

  socket.on('updateNickname', (nickname) => {
    userList = userList.filter((user) => user.userId !== socket.id);
    userList.push({ userId: socket.id, nickname });
    io.emit('userList', userList);
  });

  socket.on('disconnect', () => {
    userList = userList.filter((user) => user.userId !== socket.id);
    io.emit('userList', userList);
    console.log(userList);
  });
});

app.use(bodyParser.json());
app.use('/message', router);
app.use('/', express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
