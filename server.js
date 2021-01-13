const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', (_, res) => {
  res.render('index.html');
});

io.on('connection', (socket) => {
  console.log(`${socket} conectado!`);

  socket.emit('teste', socket.id);
});

server.listen(3000, () => {
  console.log('Conectado!');
});
