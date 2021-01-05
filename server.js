const express = require('express');
const path = require('path');
const cors = require('cors');
const moment = require('moment');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { getAll, add } = require('./models/messagesModel');

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

io.on('connection', async (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  const messages = await getAll();

  socket.emit('previewsMessages', messages);

  socket.on('message', async (data) => {
    const dateTime = moment(new Date()).format('DD-MM-yyyy h:mm:ss A');
    // const dateTime = new Date().toLocaleString('pt-BR', { hour12: true });
    await add(dateTime, data);
    const userData = {
      dateTime,
      nickname: data.nickname,
      chatMessage: data.chatMessage,
    };
    socket.broadcast.emit('receivedMessage', userData);
    socket.emit('receivedMessage', userData);
  });
});

server.listen(3000, () => {
  console.log('conectado');
});
