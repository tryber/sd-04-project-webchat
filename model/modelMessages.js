const connection = require('./connection');
require('dotenv').config();

const saveMessage = async (dateTime, nickname, chatMessage) => {
  const db = await connection();
  const result = await db
    .collection('messages')
    .insertOne({ dateTime, nickname, chatMessage });
  return result.ops[0];
};

const getAllMessages = async () => {
  const db = await connection();
  const result = await db.collection('messages').find().toArray();
  // console.log('results', result);
  return result;
};

module.exports = { saveMessage, getAllMessages };
