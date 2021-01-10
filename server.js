const express = require('express');
const path = require('path');
const cors = require('cors');
const moment = require('moment');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { getAll, add, addMessages } = require('./models/messagesModel');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.render('index.html');
});

const online = {};

const nick = {};

io.on('connection', async (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  online[socket.id] = socket.id;

  socket.emit('newUser', socket.id);

  io.emit('updateUsers', online);

  socket.on('setNickname', (nickname) => {
    nick[socket.id] = nickname;
    socket.emit('userNick', nick);
  });

  const messages = await getAll();

  socket.emit('previewsMessages', messages);

  socket.on('message', async (data) => {
    const dateTime = moment(new Date()).format('DD-MM-yyyy h:mm:ss A');
    const timeS = new Date().getTime();
    // const dateTime = new Date().toLocaleString('pt-BR', { hour12: true });
    await add(dateTime, data);
    await addMessages(data.nickname, data.chatMessage, timeS);
    const userData = {
      dateTime,
      nickname: data.nickname,
      chatMessage: data.chatMessage,
    };
    socket.broadcast.emit('message', userData);
    socket.emit('message', userData);
  });
  socket.on('disconnect', () => {
    delete online[socket.id];
    io.emit('updateUsers', online);
  });
});

server.listen(3000, () => {
  console.log('conectado');
});
