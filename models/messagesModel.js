const connection = require('./connection');

const addMessage = async (nickname, chatMessage, timestamp) => {
  await connection().then((db) =>
    db.collection('messages').insertOne({ nickname, chatMessage, timestamp }));
};

const getMessages = () =>
  connection().then((db) => db.collection('messages').find().toArray());

const addPrivateMessage = async (nickname, chatMessage, dateTime) => {
  await connection().then((db) =>
    db.collection('privateMessages').insertOne({ nickname, chatMessage, dateTime }));
};

const getPrivateMessages = () =>
  connection().then((db) => db.collection('privateMessages').find().toArray());

module.exports = {
  addMessage,
  getMessages,
  addPrivateMessage,
  getPrivateMessages,
};
