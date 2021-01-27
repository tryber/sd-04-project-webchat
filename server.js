const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const moment = require('moment');
const model = require('./model/mainModel');
const {
  userAdd,
  //  getCurrentUser,
  changeUser,
  userLeave,
  getAllUsers,
} = require('./util/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.on('start', async () => {
    userAdd(socket.id, 'Zelda');

    const history = await model.takeData();

    socket.join('global');

    socket.emit('history', history);

    io.to('global').emit('roomUsers', {
      users: getAllUsers(),
    });
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const date = moment().format('DD-MM-yyyy HH:mm:ss');
    model.createData(nickname, chatMessage, date);

    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
  });

  socket.on('nameChange', (newName) => {
    changeUser(socket.id, newName);
    io.emit('roomUsers', {
      users: getAllUsers(),
    });
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.emit('roomUsers', {
        users: getAllUsers(),
      });
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Hey, listen! ${PORT}`));
