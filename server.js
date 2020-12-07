const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const formatMessage = require('./utils/messages');
const messageModel = require('./models/messageModel');
const router = require('./router');

/* eslint no-underscore-dangle: 0 */

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
  // const botName = 'WebChat Bot';
  // socket.emit('message', formatMessage(botName, 'Welcome to WebChat!'));

  // socket.broadcast.emit(
  //   'message',
  //   formatMessage(botName, 'A user has joined the chat'),
  // );

  // socket.on('disconnect', () => {
  //   io.emit('message', formatMessage(botName, 'A user has left the chat'));
  // });

  socket.on('message', async (message) => {
    const insertedMessage = await messageModel.insertMessage({
      nickname: message.nickname,
      message: message.chatMessage,
    });
    const messageTimestamp = ObjectID(insertedMessage._id).getTimestamp();
    console.log(
      formatMessage(message.nickname, message.chatMessage, messageTimestamp),
    );
    io.emit(
      'message',
      formatMessage(message.nickname, message.chatMessage, messageTimestamp),
    );
  });
});

app.use(bodyParser.json());
app.use('/message', router);
app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
