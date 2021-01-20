const connection = require('./connection');

const insertMsg = async (messageObj) => {
  const conn = await connection();
  const message = await conn.collection('messages').insertOne(messageObj);
  return message.ops[0];
};

const getMsgs = async () => {
  const conn = await connection();
  const messages = await conn.collection('messages').find({}).toArray();
  return messages;
};

module.exports = {
  insertMsg,
  getMsgs,
};
