const cors = require('cors');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const faker = require('faker');
const moment = require('moment');
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
    img: `https://picsum.photos/seed/${socket.id}/480`,
    nickname: faker.name.findName(),
    id: socket.id,
  };

  socket.broadcast.emit('connected', user);
  socket.emit('connecting', [...participants, { ...user, itsMe: true }]);
  participants.push(user);

  socket.on('message', async ({ chatMessage, nickname = user.nickname, activeChat = 'general' }) => {
    const messageInfo = {
      chatMessage,
      ...user,
      nickname,
      timestamp: moment(new Date()).format('DD-MM-yyyy HH:mm:ss'),
      timeSent: new Date().toLocaleTimeString('pt-BR', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
      }),
    };
    if (activeChat !== 'general') {
      io.to(activeChat).emit('message', true, messageInfo, user.id);
      socket.emit('message', true, messageInfo, activeChat);
    } else {
      await addNew('messages', messageInfo);
      io.emit('message', `${messageInfo.timestamp} ${nickname} ${chatMessage}`, messageInfo);
    }
  });

  socket.on('editName', (name) => {
    user.nickname = name;
    io.emit('editName', { name, id: user.id });
  });

  socket.on('disconnect', () => {
    participants = participants.filter((part) => part.id !== socket.id);
    io.emit('disconnect', socket.id);
  });
});

httpServer.listen(3000, () => console.log('Navi: heey liisten'));
