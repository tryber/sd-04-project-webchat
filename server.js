const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(cors());
app.use('/', express.static(path.join(__dirname, '/app')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

io.on('connection', (socket) => {
  console.log('Usuário conectado');

  socket.on('message', (message) => {
    console.log(`messageEvent: ${message}`);
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
  });
});

app.get('/ping', (_, res) => {
  res.status(200).json({ message: 'pong!' });
});

http.listen(3000);
console.log('Express ouvindo na porta 3000');
