const connection = require('./connection');

const insertMessages = async (chatMessage, nickname, timestamp) => {
  const db = await connection();
  const result = await db.collection('messages').insertOne({ chatMessage, nickname, timestamp });
  return result.ops[0];
};

const getAllMessages = async () => {
  const db = await connection();
  return db.collection('messages').find().toArray();
};

module.exports = {
  insertMessages,
  getAllMessages,
};
