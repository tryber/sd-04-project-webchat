const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
const moment = require('moment');

const chatModel = require('./model/chatModel');

app.use(cors());

// app.use('/', express.static(path.join(__dirname, 'public')));

// const socketIoServer = http.createServer(app);

const sockets = [];
const userNamesArr = [];

app.set('view engine', 'ejs');

io.on('connection', async (socket) => {
  console.log(`O socket: ${socket.id} foi conectado!`);
  sockets.push(socket);

  socket.on('disconnect', async () => {
    console.log(`O socket ${socket.id} desconectou :(`);
    chatModel.eraseNames(socket.id);
    socket.emit('makeNewListOfNames');
  });

  socket.on('listUsers', async (name) => {
    console.log(name);
    userNamesArr.push(name); // AQUI INSERI O NOME NUM ARRAY DO BACK PARA QUE O SERVER POSSA USAR
    chatModel.registerNames(name, socket.id);
  });

  socket.on('makeNameTrip', (name) => {
    io.emit('insertTheName', name);
  });

  const history = await chatModel.registeredHistoric();
  socket.emit('renderInit', history);
  // io.emit('usersList', sockets);

  const listOfUsers = await chatModel.registeredNames();
  console.log('AQUI LIST OF USERS');
  socket.emit('renderNames', listOfUsers);

  socket.on('message', async (data) => {
    const time = new Date();
    const timestamp = moment(time).format('DD-MM-yyyy HH:mm:ss');

    chatModel.registerData(data, timestamp);

    // let history = await chatModel.registeredHistoric();

    io.emit('message', `${timestamp} - ${data.nickname} : ${data.chatMessage}`);
  });
});

// AGORA TENHO QUE RENDERIZAR O NOME NA TELA TAMBÉM

app.get('/', (_req, res) => {
  res.render('index');
});

http.listen(3000, () => {
  console.log('Server http running on 3000 port');
});
