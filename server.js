const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const moment = require('moment');
const cors = require('cors');
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
app.use(cors());
const names = ['Zelda', 'Link'];
let indexNames = 0;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.on('start', async () => {
    userAdd(socket.id, names[indexNames]);

    if (indexNames === 0) {
      indexNames += 1;
    }
    else {
      indexNames -= 1;
    }

    const history = await model.takeData();

    socket.join('global');

    socket.emit('history', history);

    io.to('global').emit('roomUsers', {
      users: getAllUsers(),
    });
  });

  socket.on('message', ({ chatMessage, nickname, state }) => {
    const date = moment().format('DD-MM-yyyy HH:mm:ss');
    if (state && state === 'private') {
      return io.to(state).emit('message', `${date} (private) - ${nickname}: ${chatMessage}`);
    }
    model.createData(nickname, chatMessage, date);

    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
  });

  socket.on('nameChange', (newName) => {
    changeUser(socket.id, newName);
    io.emit('roomUsers', {
      users: getAllUsers(),
    });
  });

  socket.on('stateJoin', (state) => {
    socket.join(state);
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
