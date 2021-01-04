require('dotenv').config();
const cors = require('cors');
const path = require('path');
const express = require('express');

const PUBLIC_PATH = path.join(__dirname, 'public');
const PORT = process.env.PORT || 3000;

/** Express app */
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', express.static(PUBLIC_PATH));

/** Web Server */
const server = require('http').createServer(app);

/** Websocket */
const socketIo = require('socket.io')(server);
const socketService = require('./services/messagesSocket');
/** Initialize socket */
socketService(socketIo);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
