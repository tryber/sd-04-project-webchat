const express = require('express');
const path = require('path');
const moment = require('moment');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

io.on('connection', (socket) => {
  console.log('Conectado');

  socket.on('message', (message) => {
    const time = new Date();
    const timestamp = moment(time).format('DD-MM-yyyy HH:mm:ss');
    const msg = `${timestamp} - ${message.nickname}: ${message.chatMessage}`;
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    io.emit('adeus', { mensagem: 'Poxa, fica mais, vai ter bolo :)' });
  });
});

http.listen(3000, () => {
  console.log('listening on port 3000');
});
