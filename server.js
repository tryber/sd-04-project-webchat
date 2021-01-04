require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const moment = require('moment');
const Model = require('./models/chatModel');

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Conexão
io.on('connection', async (socket) => {
  
});

server.listen(PORT, () => console.log(`Ouvindo na porta ${PORT}`));
