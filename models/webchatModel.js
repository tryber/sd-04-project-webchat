const connection = require('./connection');

const saveMessages = async (chatMessage, nickname, timestamp) =>
  connection()
    .then((db) =>
      db.collection('messages').insertOne({ chatMessage, nickname, timestamp }))
    .then(({ insertedId }) => ({
      _id: insertedId,
      chatMessage,
      nickname,
      timestamp,
    }));

const getHistory = async () =>
  connection().then((db) => db.collection('messages').find({}).toArray());

module.exports = { saveMessages, getHistory };
