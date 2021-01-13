const connection = require('./connection');

const addMessage = async (nickname, chatMessage, timestamp) => {
  await connection().then((db) =>
    db.collection('messages').insertOne({ nickname, chatMessage, timestamp }));
};

const getMessages = () =>
  connection().then((db) => db.collection('messages').find().toArray());

module.exports = {
  addMessage,
  getMessages,
};
