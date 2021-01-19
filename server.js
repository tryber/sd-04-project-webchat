const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const httpServer = http.createServer(app);

require('dotenv').config();

const io = socketIo(httpServer)

const {
  messagesController,
} = require('./controllers');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'views')));

app.post('/chat',
  messagesController.sendPublicMensage(io),
);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => console.log('Escutando na porta 4555'));
