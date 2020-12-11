// O PROJETO É MEU E EU COMENTO DO JEITO QUE QUISER.
const express = require('express');
const http = require('http');
const path = require('path');
const moment = require('moment');

const app = express();

const socketIoServer = http.createServer(app);

const io = require('socket.io')(socketIoServer);
const models = require('./models/modelsMassage');

app.use('/', express.static(path.join(__dirname, '/public')));

// sempre que o socketio receber uma conexão vai realizar o broadcast dela
io.on('connection', async (socket) => {
  const conectados = [];

  const historyMessage = await models.getAllMessages();
  const msgHisto = [];
  historyMessage.map((msg)=> {
    const { chatMessage, nickname, timestamp } = msg
    return msgHisto.push(`${timestamp} - ${nickname}: ${chatMessage}`);
  });
  io.emit('Historico', msgHisto);

  socket.on('message', async ({ chatMessage, nickname }) => {
    const time = new Date();
    const timestamp = moment(time).format('DD-MM-yyyy HH:mm:ss');
    const renderMessage = `${timestamp} - ${nickname}: ${chatMessage}`;

    io.emit('message', renderMessage);

    conectados.push(nickname);
    io.emit('online', conectados);

    socket.on('disconnect', () => {
      delete conectados[socket.id];
      io.emit('online', conectados);
    });

    await models.createMessage(chatMessage, nickname, timestamp);
  });

  socket.on('changeName', async ({ nickname }) => {
    io.emit('changeName', nickname);
  });

});

// qnd servidor recebe uma connection esse evento é executado
// io.on('connection', (socket) => {
//   console.log('Cliente conectado', socket.id);
//   socket.on('msg', (msg) => {
//     console.log(msg);
//     socket.broadcast.emit('msg', msg);

//   });
// });

socketIoServer.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
