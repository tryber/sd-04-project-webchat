const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const { saveMessage, getMessages } = require('./model/message');

let onlineUsers = [];
// https://pt.stackoverflow.com/questions/6526/como-formatar-data-no-javascript
// https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

io.on('connection', async (socket) => {
  const oldMessages = await getMessages();
  io.emit('oldMessages', oldMessages);

  socket.on('message', async ({ chatMessage, nickname }) => {
    const newDate = new Date();
    const data = newDate.toISOString().substr(0, 10).split('-').reverse()
      .join('-');
    const time = newDate.toLocaleString([], { hour12: true }).substr(11);
    const date = `${data} ${time}`;
    await saveMessage(date, chatMessage, nickname);
    const composeMessage = await `${date} - ${nickname}: ${chatMessage}`;
    io.emit('message', composeMessage);
  });

  socket.on('logged', ({ nickname }) => {
    onlineUsers.push({ userId: socket.id, nickname });
    io.emit('setUsersList', onlineUsers);
  });

  socket.on('changeNick', ({ newNick }) => {
    onlineUsers = onlineUsers.filter(({ userId }) => userId !== socket.id);
    onlineUsers.push({ userId: socket.id, nickname: newNick });
    io.emit('setUsersList', onlineUsers);
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(({ userId }) => userId !== socket.id);
    io.emit('setUsersList', onlineUsers);
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
