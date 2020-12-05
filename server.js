const app = require('express')();
const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

require('dotenv').config();

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

io.on('connection', (socket) => {
  console.log('Conectado');
  socket.on('disconnect', () => {
    console.log('Desconectado');
  });
  app.post('/', (req, res) => {
    console.log(process.env.DB_NAME);
    const { title, msg } = req.body;

    if (!title || !msg) {
      return res.status(422).json({ message: 'Missing title or message' });
    }

    io.emit('notification', { title, msg });
    return res.status(200).json({ message: 'Succes!' });
  });
});
http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
