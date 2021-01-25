const express = require('express');
const socketIoServer = require('http').createServer();
const io = require('socket.io')(socketIoServer);
const cors = require('cors');
const path = require('path');
const moment = require('moment');

const app = express();

const EXPRESS_PORT = process.env.EXPRESS_PORT ?? 3000;
const SOCKET_IO_PORT = process.env.SOCKET_IO_PORT ?? 3333;

app.use(express.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(EXPRESS_PORT, console.log(`Express listening at port: ${EXPRESS_PORT}`));

socketIoServer.listen(
  SOCKET_IO_PORT,
  console.log(`Socket.io listening at port: ${SOCKET_IO_PORT}`),
);
