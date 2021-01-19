const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const Messages = require('./model/Messages');

app.use(cors());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

io.on('connection', async (socket) => {
  const allMessages = await Messages.getMessages() || [];

  allMessages.forEach((data) => socket.emit('receivedMessage', data));

  socket.on('message', async (data) => {
    const storedResult = await Messages.saveUserMessage(data);
    socket.emit('receivedMessage', storedResult);
    socket.broadcast.emit('receivedMessage', storedResult);
  });
});

server.listen(3000, () => {
  console.log('Server rodando na porta 3000!');
});
