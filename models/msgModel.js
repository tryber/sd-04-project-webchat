const connection = require('./connection');

const getAllMsg = async () =>
  connection()
    .then((db) => db.collection('messages').find({}).toArray());

const createMsg = async (chatMessage, nickname, timestamp) =>
  connection()
    .then((db) =>
      db.collection('messages').insertOne({ chatMessage, nickname, timestamp }))
    .then(({ insertedId }) => ({
      _id: insertedId,
      chatMessage,
      nickname,
      timestamp,
    }));

module.exports = { getAllMsg, createMsg };
