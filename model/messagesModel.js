const connection = require('./connection');

const getAllMessages = async () => {
  try {
    const db = await connection();
    const messages = await db.collection('messages').find({}).toArray();

    return messages;
  } catch (err) {
    console.error('getAllMessages', err.message);
  }
};

const insertMessage = async (chatMessage, nickname, timestamp) => {
  try {
    const db = await connection();
    const insertMsg = await db.collection('messages').insertOne({ chatMessage, nickname, timestamp });

    return insertMsg.ops[0];
  } catch (err) {
    console.error('insertMessage', err.message);
  }
};

module.exports = {
  insertMessage,
  getAllMessages,
};
