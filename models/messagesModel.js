const connection = require('./connection');

const addMessage = async (message) => {
  await connection().then((db) =>
    db.collection('messages').insertOne({ message }));
};

const getMessages = () =>
  connection().then((db) => db.collection('chat').find().toArray());

module.exports = {
  addMessage,
  getMessages,
};
