const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log('conectado com ID: ', socket.id);
});

server.listen(3000, () => console.log('Running on Port 3000'));
