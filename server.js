const express = require('express');
const http = require('http');
const socket_io = require('socket.io');
const cors = require('cors');
const path = require('path');

const socketIoServer = http.createServer();

require('dotenv').config();

const io = socket_io(socketIoServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

const {
  messagesController,
} = require('./controllers');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'views')));

app.post('/chat',
  messagesController.sendPublicMensage(io),
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Express escutando na porta ${PORT}`));

socketIoServer.listen(4555, () => console.log('Socket.io escutando na porta 4555'));
