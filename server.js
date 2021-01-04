const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'views')));
// importar o model abaixo, o model traz as funçoes para salvar e mostrar as msgs
const { newMessage, findMsg } = require('./model/modelMsg');

// criar uma rota de notificação
let users = [];
const obj = {};

const dispatcher = (nickname) => {
  if (!obj.user || !obj.user.includes(nickname)) {
    obj.user = nickname;
    users.push(obj.user);
    users = users.filter((user, i) => users.indexOf(user) === i);

    io.emit('users', users);
  }
};

io.on('connection', async (socket) => {
  console.log('Connected');
  io.emit('users', users);

  const allMessages = await findMsg();
  io.emit('history', allMessages);

  socket.on('nickName', async ({ nickname }) => {
    await dispatcher(nickname);
    console.log('users', users);
  });

  socket.on('message', async ({ nickname, chatMessage }) => {
    await dispatcher(nickname);
    const data = new Date();
    const hours = data.getHours() < 13 ? 'AM' : 'PM';
    const timestamp = `${data.getDate()}-${(data.getMonth() + 1)}-${data.getFullYear()} ${data.getHours()}:${data.getMinutes()}:${data.getSeconds()} ${hours}`;

    await newMessage(chatMessage, nickname, timestamp);

    const fullMessage = `${timestamp} - ${nickname}: ${chatMessage}`;
    console.log(chatMessage);
    console.log(obj.user);
    console.log(fullMessage);

    io.emit('message', fullMessage);
  });

  socket.on('disconnect', () => {
    console.log(`${obj.user} - saiu`);

    users.splice(obj.user);
    io.emit('users', users);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
