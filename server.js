const express = require('express');
const path = require('path');
const moment = require('moment');

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const webChatModel = require('./model/webchatModel');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.render('index.html');
});

const usersOnline = {};

io.on('connection', (socket) => {
  console.log('Socket connectado', socket.id);

  const { id } = socket;

  webChatModel
    .getAll()
    .then((messages) => socket.emit('historicMessages', messages));

  socket.on('disconnect', () => {
    delete usersOnline[id];
    socket.emit('offline', usersOnline);
  });

  socket.on('saveNickname', (nickname) => {
    if (nickname.length) {
      usersOnline[id] = nickname;

      io.emit('userConnect', usersOnline);
    }
  });

  socket.on('message', async (data) => {
    const date = moment(new Date()).format('DD-MM-yyyy hh:mm:ss A');
    const dados = { date, ...data };

    await webChatModel.add(dados);

    socket.broadcast.emit(
      'message',
      `<strong>${dados.date} - ${dados.nickname}</strong>: ${dados.chatMessage}`,
    );
  });
});

server.listen(3000, () => console.log('Ouvindo na porta 3000'));
