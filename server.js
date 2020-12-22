const express = require('express');
const moment = require('moment');
const path = require('path');
const cors = require('cors');

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { messageSave, messageAll } = require('./models/messagesModel');

app.use(cors());
app.use('/', express.static(path.join(__dirname, 'front-end')));

// app.use('/', (_req, res) => {
//   res.sendFile(__dirname + '/front-end/index.html');
// });
function createMessage({ nickname, chatMessage, timestamp }) {
  return `${timestamp} - ${nickname}: ${chatMessage}`;
}
io.on('connection', async (socket) => {
  let loggedUser = [];
  const allMsg = [];
  loggedUser.push({ userNumber: socket.id, userName: socket.user });
  console.log(`socket conectato: ${socket.id}`);
  const allMessages = await messageAll();
  allMessages.map((element) => {
    const { chatMessage, nickname, timestamp } = element;
    return allMsg.push(`${timestamp} - ${nickname}: ${chatMessage}`);
  });

  socket.emit('allMessage', allMsg);
  socket.on('message', async ({ nickname, chatMessage }) => {
    const currentTime = new Date();
    const timestamp = moment(currentTime).format('DD-MM-yyyy HH:mm:ss');
    const menssagem = createMessage({ nickname, chatMessage, timestamp });
    io.emit('message', menssagem);
    await messageSave({ nickname, chatMessage, timestamp });
    // socket.broadcast.emit('recivedMessage', menssagem);
  });
  socket.on('changeName', (name) => {
    const socket2 = socket;
    socket2.user = name;
    loggedUser.map((element) => {
      const element2 = element;
      if (element2.userNumber === socket.id) element2.userName = name;
      return element2;
    });
    return io.emit('loggedUsers', loggedUser);
  });
  socket.on('disconnect', () => {
    loggedUser = loggedUser.filter((element) => element.userNumber !== socket.id);
  });
});

http.listen(3000, () => console.log('Express ouvindo na porta 3000'));
