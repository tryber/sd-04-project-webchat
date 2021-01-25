const modelChat = require('../model/modelChat');

const saveMessagePrivate = (from, to, message) => {
  modelChat.saveMessagePrivate(from, to, message);
};

module.exports = saveMessagePrivate;
