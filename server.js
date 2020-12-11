const cors = require('cors');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const faker = require('faker');
const controllers = require('./controllers');
const { addNew } = require('./models/genericModel');

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);
let participants = [];

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', controllers.client.chat);

app.use('/public', express.static('public'));
io.on('connection', (socket) => {
  const user = {
    color: `hsl(${Math.random() * 360}, 100%, ${Math.random() * 21 + 50}%)`,
    img: faker.image.imageUrl(480, 480),
    nickname: faker.name.findName(),
    id: socket.id,
  };
  socket.broadcast.emit('connected', user);
  socket.emit('connecting', [...participants, { ...user, itsMe: true }]);
  participants.push(user);

  socket.on('message', async ({ chatMessage, nickname = user.nickname }) => {
    const message = {
      chatMessage,
      ...user,
      nickname,
      timestamp: new Date().getTime(),
      timeSent: new Date().toLocaleTimeString('pt-BR', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
      }),
    };
    await addNew('messages', message);
    io.emit('message', message);
  });

  socket.on('editName', (name) => {
    user.nickname = name;
    socket.broadcast.emit('editName', { name, id: user.id });
  });

  socket.on('disconnect', () => {
    participants = participants.filter((part) => part.id !== socket.id);
    io.emit('disconnect', socket.id);
  });
});

httpServer.listen(3000, () => console.log('Navi: heey liisten'));

module.exports = { participants };
