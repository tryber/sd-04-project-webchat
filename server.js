const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);          

app.use(cors());
app.use('/', express.static(path.join(__dirname, 'front-end')));

// app.use('/', (_req, res) => {
//   res.sendFile(__dirname + '/front-end/index.html');
// });

io.on('connection', (socket) => {
  console.log(`socket conectato: ${socket.id}`);
});

http.listen(3000, () => console.log('Express ouvindo na porta 3000'));
