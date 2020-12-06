const connection = require('./connection');

const saveMessages = async (message, nickname, timestamp) =>
  connection()
    .then((db) =>
      db.collection('messages').insertOne({ message, nickname, timestamp }))
    .then(({ insertedId }) => ({
      _id: insertedId,
      message,
      nickname,
      timestamp,
    }));

const getHistory = async () =>
  connection().then((db) => db.collection('messages').find({}).toArray());

module.exports = { saveMessages, getHistory };
