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

let usersStatus = [];

io.on('connection', async (socket) => {
  const allMessages = (await Messages.getMessages()) || [];

  allMessages.forEach(({ chatMessage, nickname, messageDate }) =>
    socket.emit('message', `${messageDate} ${nickname} ${chatMessage}`));

  socket.on('message', async ({ chatMessage, nickname }) => {
    const storedResult = await Messages.saveUserMessage(chatMessage, nickname);
    socket.emit('message', storedResult);
    socket.broadcast.emit('message', storedResult);
  });

  // Private Mesages
  socket.on('private message', async ({ userSocketId, userMessageInfo }) => {
    const { chatMessage, nickname } = userMessageInfo;
    const storedResult = await Messages.saveUserMessage(chatMessage, nickname);
    const splited = storedResult.split(' ');
    const formatada = `${splited[0]} ${splited[1]} (private) - ${nickname}: ${chatMessage}`;
    console.log('storedResult: ', formatada);


    socket.emit('private message', formatada);
    // socket.to(socket.id).emit('private message', formatada);
    socket.to(userSocketId).emit('private message', formatada);
    // io.emit('private message', formatada);
    // socket.broadcast.emit('message', storedResult);
  });

  socket.on('status', async ({ nickname }) => {
    const userPositon = usersStatus.findIndex((user) => user.socketId === socket.id);
    if (userPositon === -1) {
      usersStatus.push({ socketId: socket.id, nickname });
    } else {
      usersStatus[userPositon].nickname = nickname;
    }
    io.emit('userStatus', usersStatus);
  });

  socket.on('disconnect', async () => {
    usersStatus = usersStatus.filter(({ socketId }) => socketId !== socket.id);
    io.emit('userStatus', usersStatus);
  });
});

server.listen(3000, () => {
  console.log('Server rodando na porta 3000!');
});
