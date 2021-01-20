const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const moment = require('moment');
require('dotenv').config();


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const { getAllMessages, addMessage } = require('./models/message');

const PORT = 3000 || process.env.PORT

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// app.get('/', (req, res) => {
//   res.status(200).json({msg: 'ola'})
// })

io.on('connection', async (socket) => {
  const allMessage = await getAllMessages();
  console.log('conected');
  console.log('allMessages', allMessage);
  socket.emit('allMessage', allMessage);

  socket.on('message', async ({ chatMessage, nickname }) => {
    console.log('chatMessage', chatMessage);
    console.log('nick', nickname);
    const timestamp = moment().format('h:mm a');
    console.log('time', timestamp);
    const newMsg = `${timestamp} - ${nickname}: ${chatMessage}`;
    socket.emit('message',newMsg);

    socket.broadcast.emit('message',newMsg);
    await addMessage(chatMessage, nickname , timestamp);
  });

  socket.on('changeName', () => {});
  socket.on('users', () => {});
  socket.on('disconect', () => {});
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));