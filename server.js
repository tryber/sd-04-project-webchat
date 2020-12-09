// O PROJETO É MEU E EU COMENTO DO JEITO QUE QUISER.
const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

const socketIoServer = http.createServer(app);

const io = require('socket.io')(socketIoServer);

app.use('/', express.static(path.join(__dirname, '/public')));

io.on('connection', (socket) => {
  console.log('Cliente conectado', socket.id);
});

socketIoServer.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
