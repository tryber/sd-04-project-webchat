const connection = require('./connection');
require('dotenv').config();

const getAll = async () => connection().then((db) => db.collection('chats').find().toArray());

const add = async (dateTime, nickChat) => {
  const result = await connection().then((db) =>
    db.collection('chats').insertOne({ dateTime, nickname: nickChat.nickname, chatMessage: nickChat.chatMessage }));
  return result.ops[0];
};

module.exports = {
  add,
  getAll,
};
