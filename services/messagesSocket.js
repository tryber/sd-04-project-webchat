const moment = require('moment');
const { saveMessages, getMessages } = require('../model/message');

const socketService = (socketIo) => {
  socketIo.on('connection', async (socket) => {
    socket.on('message', async ({ chatMessage, nickname }) => {
      const date = new Date();
      const timestamp = moment(date).format('DD-MM-yyyy HH:mm:ss');
      const message = `${timestamp} - ${nickname}: ${chatMessage}`;

      saveMessages({ chatMessage, nickname, timestamp })
        .then(() => {
          socketIo.emit('message', message);
        });
    });

    socket.on('online', async ({ nickname }) => {
      socketIo.emit('online', nickname);
    });

    /** Load msgs history */
    getMessages()
      .then((msgs) => socketIo.emit('history', msgs));
  });
};

module.exports = socketService;
