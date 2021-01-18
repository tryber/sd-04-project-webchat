const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
app.get('/', (_req, res) => res.sendFile(__dirname + '/public'));

io.on('connection', () => {});

server.listen(3000, () => {
  console.log('Server rodando na porta 3000!');
});
