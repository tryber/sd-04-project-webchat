const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

io.on('connection', async (socket) => {
  socket.on('sendMessage', async (data) => {
    await socket.broadcast.emit('receivedMessage', data);
  });
});

server.listen(3000, () => {
  console.log('Server rodando na porta 3000!');
});
