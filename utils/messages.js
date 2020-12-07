const moment = require('moment');

const formatMessage = (nickname, chatMessage, timestamp) => {
  const message = {
    nickname,
    chatMessage,
    timestamp: timestamp
      ? moment(new Date(timestamp))
        .locale('pt-br')
        .format('DD-MM-YYYY HH:mm:ss')
      : moment(new Date()).locale('pt-br').format('DD-MM-YYYY HH:mm:ss'),
  };

  return `${message.timestamp} - ${message.nickname}: ${message.chatMessage}`;
};

module.exports = formatMessage;
