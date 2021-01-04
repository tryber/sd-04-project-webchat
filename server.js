require('dotenv').config();
const cors = require('cors');
const path = require('path');
const express = require('express');
const moment = require('moment');

/** Express app */
const app = express();

/** Web Server */
const server = require('http').createServer(app);

const PORT = process.env.PORT || 3000;
const PUBLIC_PATH = path.join(__dirname, 'public');

/** Websocket */
const io = require('socket.io')(server);
const { saveMessages, allMessages } = require('./models/messagesModel');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/', express.static(PUBLIC_PATH));

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
