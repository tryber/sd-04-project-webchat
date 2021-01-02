const express = require('express');
const path = require('path');
// const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
// app.set('views', path.join(__dirname, 'public'));
// app.engine('html', require('ejs').renderFile);

// app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.render('index.html');
});

const messages = [];

io.on('connection', (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.emit('previewsMessages', messages);

  socket.on('message', (data) => {
    messages.push(data);
    socket.broadcast.emit('receivedMessage', data);
  });
});

server.listen(3000, () => {
  console.log('conectado');
});
