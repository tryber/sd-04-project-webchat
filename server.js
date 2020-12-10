const express = require('express');
const path = require('path');
const moment = require('moment');
const {} = require('unique-names-generator');

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

// const addCart = () => {
//   if (!cart[name]) cart[name] = { ...product, quantidade: 1 };

// };

// const removeCart = () => {
//   delete cart[name];
// };

const usersOnline = {};

io.on('connection', (socket) => {
  console.log('Socket connectado', socket.id);
  const { id } = socket;

  webChatModel
    .getAll()
    .then((messages) => socket.emit('historicMessages', messages));

  socket.emit('userConnect', usersOnline);

  socket.on('disconnect', () => {
    console.log('Aqwui')
    socket.emit('offline', usersOnline[socket.id])
  });

  socket.on('message', async (data) => {
    const date = moment(new Date()).format('DD-MM-yyyy hh:mm:ss A');
    const dados = { date, ...data };
    const { nickname } = data;

    if (usersOnline[id] != data.nickname) usersOnline[id] = nickname;

    await webChatModel.add(dados);

    socket.broadcast.emit(
      'message',
      `<strong>${dados.date} - ${dados.nickname}</strong>: ${dados.chatMessage}`,
    );
  });
});

server.listen(3000, () => console.log('Ouvindo na porta 3000'));
