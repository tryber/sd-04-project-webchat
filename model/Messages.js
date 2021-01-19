const moment = require('moment');
const connect = require('./connection');

const getMessages = async () => {
  try {
    const db = await connect();
    const result = await db
      .collection('messages')
      .find()
      .toArray();

    return result;
  } catch (error) {
    console.error(error.message);
  }
};

const saveUserMessage = async ({ chatMessage, nickname }) => {
  const messageDate = moment(new Date()).format('DD-MM-yyyy HH:mm:ss');
  try {
    const db = await connect();
    await db
      .collection('messages')
      .insertOne({ chatMessage, nickname, messageDate });

    return {
      chatMessage,
      nickname,
      messageDate,
    };
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  getMessages,
  saveUserMessage,
};
