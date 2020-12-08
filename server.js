const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
let userId = 0;

// https://pt.stackoverflow.com/questions/6526/como-formatar-data-no-javascript
// https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  userId++;
  socket.user = `User ${ userId }`;
  io.emit('sendNick', socket.user )

  socket.on('message', async (message) => {
    const newDate = new Date()
    const data = newDate.toISOString().substr(0, 10).split('-').reverse().join('-')
    const time = newDate.toLocaleString([], { hour12: true}).substr(11);
    const composeMessage = await `${ data } ${ time } - ${ message.nickname }: ${ message.chatMessage }`
    io.emit('showMsg', composeMessage);
  });

  socket.on('changeNick', async (nickname) => {
    io.emit('newNick', nickname);
  });

  socket.on('disconnect', () => {
    io.emit('adeus');
  });
});

http.listen(3000, () => {
  console.log("Servidor ouvindo na porta 3000");
});
