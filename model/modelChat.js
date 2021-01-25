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

const saveMessagePrivate = async (from, to, message) => {
  const db = await connection();
  await db
    .collection('messagePrivate')
    .updateOne(
      { $and: [{ from }, { to }] },
      { $push: { message } },
      { upsert: true }
    );
  // return result.ops[0];
};

const getPrivateMessage = async (from, to) => {
  const db = await connection();
  console.log('from', from);
  const result = await db
    .collection('messagePrivate')
    .find({ $and: [{ from }, { to }] })
    .toArray();
  // console.log('getAllMessage', result);
  return result;
};

module.exports = {
  saveMessage,
  saveUserChat,
  getAllUsers,
  getAllMessages,
  removeUser,
  saveMessagePrivate,
  getPrivateMessage,
};
