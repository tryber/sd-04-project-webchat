require('dotenv').config();
const cors = require('cors');
const path = require('path');
const express = require('express');
const moment = require('moment');

const app = express();
// vou criar apenas uma rota de servidor, poderia ser feito com rotas distintas também.
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { saveMessages, allMessages } = require('./models/messagesModel');

const PORT = process.env.PORT || 3000;
const PUBLIC_PATH = path.join(__dirname, 'public');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', express.static(PUBLIC_PATH));

io.on('connection', async (socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const date = new Date();
    const timestamp = moment(date).format('DD-MM-yyyy HH:mm:ss');
    const sendMessage = `${timestamp} - ${nickname}: ${chatMessage}`;

    io.emit('online', nickname);
    io.emit('message', sendMessage);
    // socket.broadcast.emit('message', sendMessage);
    await saveMessages({ nickname, chatMessage, timestamp });
  });

  const messageDB = await allMessages();

  // messageDB.forEach(({ chatMessage, nickname, timestamp }) => {
  //   socket.emit('historico', `${timestamp} - ${nickname}: ${chatMessage}`);
  // });

  const msgSend = [];
  messageDB.map((element) => {
    const { chatMessage, nickname, timestamp } = element;
    return msgSend.push(`${timestamp} - ${nickname}: ${chatMessage}`);
  });
  socket.emit('historico', msgSend);

  // socket.on('nameChange', (nickname) => {
  //   const index = msgSend.findIndex((e) => e.id === socket.id);
  //   if (msgSend[index]) msgSend[index].nickname = nickname;
  //   io.emit('userList', msgSend);
  // });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Portas separadas

// app.listen(3000, () => {
//   console.log('Express ouvindo na porta 3000');
// });
// server.listen(4555, () => {
//   console.log('Socket.io ouvindo na porta 4555');
// });
