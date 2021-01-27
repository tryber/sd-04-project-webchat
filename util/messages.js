const moment = require('moment');
const model = require('../model/mainModel');

function FormatMessage(nickname, chatMessage) {
  const date = moment().format('DD-MM-yyyy HH:mm:ss');
  model.createData(nickname, chatMessage, date);
  return {
    nickname,
    chatMessage,
    date,
  };
}

module.exports = FormatMessage;
