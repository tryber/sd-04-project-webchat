require('dotenv').config();
const cors = require('cors');
const path = require('path');
const express = require('express');
const moment = require('moment');

const app = express();
// vou criar apenas uma rota de servidor, poderia ser feito com rotas distintas também.
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { saveMessages } = require('./models/messagesModel');

const PORT = process.env.PORT || 3000;
const PUBLIC_PATH = path.join(__dirname, 'public');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', express.static(PUBLIC_PATH));

io.on('connection', async (socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const date = new Date();
    const timestamp = moment(date).format('DD-MM-yyyy h:mm:ss A');
    const sendMessage = `${timestamp} ${nickname}: ${chatMessage}`;

    socket.emit('message', sendMessage);
    socket.broadcast.emit('message', sendMessage);
    await saveMessages({ nickname, chatMessage, timestamp });
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// app.listen(3000, () => {
//   console.log('Express ouvindo na porta 3000');
// });
// server.listen(4555, () => {
//   console.log('Socket.io ouvindo na porta 4555');
// });
