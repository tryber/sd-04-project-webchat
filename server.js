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

  allMessages.forEach(({ chatMessage, nickname, messageDate }) =>
    socket.emit('message', `${messageDate} ${nickname} ${chatMessage}`),
  );

  socket.on('message', async ({ chatMessage, nickname }) => {
    const storedResult = await Messages.saveUserMessage(chatMessage, nickname);
    socket.emit('message', storedResult);
    socket.broadcast.emit('message', storedResult);
  });
});

server.listen(3000, () => {
  console.log('Server rodando na porta 3000!');
});
