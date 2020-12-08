const moment = require('moment');

const formatMessage = (nickname, chatMessage, timestamp) => {
  const message = {
    nickname,
    chatMessage,
    timestamp: moment(new Date(timestamp)).format('DD-MM-yyyy hh:mm:ss A'),
  };

  return `${message.timestamp} - ${message.nickname}: ${message.chatMessage}`;
};

module.exports = formatMessage;
