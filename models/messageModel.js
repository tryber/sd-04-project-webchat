const connection = require('./connection');

const insertMessage = async (messageObj) => {
  const conn = await connection();
  const message = await conn.collection('messages').insertOne(messageObj);
  return message.ops[0];
};

const getAllMessages = async () => {
  const conn = await connection();
  const messages = await conn.collection('messages').find({}).toArray();
  return messages;
};

module.exports = {
  insertMessage,
  getAllMessages,
};
