const connection = require('../services/connection');

const saveMessages = async ({ chatMessage, nickname, timestamp }) => {
  try {
    const db = await connection();
    const msg = await db
      .collection('messages')
      .insertOne({ chatMessage, nickname, timestamp });
    const { insertId: _id } = msg;
    return {
      _id,
      chatMessage,
      nickname,
      timestamp,
    };
  } catch (error) {
    console.error(error);
  }
};

const getMessages = async () =>
  connection()
    .then((schema) => schema.collection('messages').find({}).toArray())
    .then((result) => result);

module.exports = {
  saveMessages,
  getMessages,
};
