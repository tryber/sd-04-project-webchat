const http = require('http');
const express = require('express');
const socket_io = require('socket.io');

const socketIoServer = http.createServer(); // cria o servidor
const io = socket_io(socketIoServer); // a partir daqui que escuta

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(3000);
console.log('Express ouvindo na porta 3000');

socketIoServer.listen(4555);
console.log('socket.io ouvindo na porta 4555');
