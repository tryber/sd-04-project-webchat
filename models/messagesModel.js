require('dotenv').config();
const moment = require('moment');
const connection = require('../tests/helpers/db');

const getMessages = async () => {
  try {
    const db = await connection();
    const messages = await db.collection('messages').find({}).toArray();
    return messages;
  } catch (err) {
    console.error(err.message);
  }
};

const createMessage = async ({ nickname, chatMessage }) => {
  try {
    const createdAt = moment(new Date()).format('DD-MM-YYYY hh:mm:ss');
    const db = await connection();
    await db.collection('messages').insertOne({
      nickname,
      chatMessage,
      createdAt,
    });
    const messageToSend = `${createdAt} - ${nickname}: ${chatMessage}`;
    return messageToSend;
  } catch (err) {
    console.log('Error', err);
  }
};

module.exports = {
  getMessages,
  createMessage,
};
