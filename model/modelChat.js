const connection = require('./connection');
require('dotenv').config();

const saveMessage = async (dateTime, nickname, chatMessage) => {
  const db = await connection();
  const result = await db
    .collection('messages')
    .insertOne({ dateTime, nickname, chatMessage });
  return result.ops[0];
};

const saveUserChat = async (idName, name) => {
  const db = await connection();
  await db.collection('userChat').insertOne({ idName, name });
};

const getAllUsers = async () => {
  const db = await connection();
  const result = await db.collection('userChat').find().toArray();
  return result;
};

const getAllMessages = async () => {
  const db = await connection();
  const result = await db.collection('messages').find().toArray();
  return result;
};

const removeUser = async (id) => {
  const db = await connection();
  await db.collection('userChat').deleteOne({ idName: id });
};

module.exports = {
  saveMessage,
  saveUserChat,
  getAllUsers,
  getAllMessages,
  removeUser,
};
