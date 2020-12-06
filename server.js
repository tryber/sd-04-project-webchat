require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// const webchatModel = require('./models/webchatModel');

app.use('/', express.static(path.join(__dirname, 'public')));

io.on('connection', async (_socket) => {
  console.log('conectou');
});

const { PORT } = process.env;

http.listen(PORT, () => {
  console.log(`Ouvindo na ${PORT}`);
});
