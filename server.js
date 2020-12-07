require('dotenv').config();

const express = require('express');
const path = require('path');

//  https://tableless.com.br/trabalhando-com-moment/
const moment = require('moment');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const webchatModel = require('./models/webchatModel');

app.use('/', express.static(path.join(__dirname, 'public')));

io.on('connection', async (socket) => {
  console.log('usuário se contectou');

  socket.on('message', async ({ nickname, chatMessage }) => {
    const timestamp = moment().format('DD-MM-yyyy HH:mm:ss');

    const message = `${timestamp} ${nickname} ${chatMessage}`;

    io.emit('message', message);

    return webchatModel.saveMessages(message, nickname, timestamp);
  });
});

const { PORT } = process.env;

http.listen(PORT, () => {
  console.log(`Ouvindo na ${PORT}`);
});
