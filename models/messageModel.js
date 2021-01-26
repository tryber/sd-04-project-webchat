const connection = require('./connection');

const createMessage = async (messageObj) => {
  const conn = await connection();
  const message = await conn.collection('messages').insertOne(messageObj);
  return message.ops[0];
};

const createPrivateMessage = async (messageObj) => {
  const conn = await connection();
  const message = await conn.collection('private').insertOne(messageObj);
  return message.ops[0];
};

const getMessages = async () => {
  const conn = await connection();
  const messages = await conn.collection('messages').find({}).toArray();
  return messages;
};

const getPrivateMessages = async () => {
  const conn = await connection();
  const messages = await conn.collection('private').find({}).toArray();
  return messages;
};

module.exports = {
  createMessage,
  createPrivateMessage,
  getMessages,
  getPrivateMessages,
};
