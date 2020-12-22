const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
// const path = require('path');

const chatModel = require('./model/chatModel');
// const { connect } = require('socket.io-client');

app.use(cors());

// app.use('/', express.static(path.join(__dirname, 'public')));

// const socketIoServer = http.createServer(app);

const sockets = [];
// const obj = {};

app.set('view engine', 'ejs');

io.on('connection', async (socket) => {
  console.log(`O socket: ${socket.id} foi conectado!`);
  sockets.push(socket);

  const history = await chatModel.registeredHistoric();
  socket.emit('renderInit', history);
  // io.emit('usersList', sockets);

  socket.on('disconnect', (socketOn) => {
    console.log(`O socket ${socketOn.id} desconectou :(`);
  });

  socket.on('message', async (data) => {
    chatModel.registerData(data);

    const historyOn = await chatModel.registeredHistoric();

    io.emit('renderInit', historyOn);

    /* io.emit(
      'historic',
      `${new Date().toLocaleString()} - ${data.nickname} : ${data.chatMessage}`
    ); */
  });
});

app.get('/', (req, res) => {
  res.render('index');
});

http.listen(3000, () => {
  console.log('Server http running on 3000 port');
});
