//const { db } = require('mongodb');
const connection = require('../helpers/db');

const registerData = (data) => {
  connection().then((db) => {
    db.collection('messages').insertOne({
      nickname: data.nickname,
      chatMessage: data.chatMessage,
      date: new Date(),
    });
  });
};

const registeredHistoric = async () => {
  const lastAdded = await connection().then((db) => {
    db.collection('messages').find().sort(new Document('_id', 1));
  });
  return lastAdded;
};

module.exports = { registerData, registeredHistoric };
