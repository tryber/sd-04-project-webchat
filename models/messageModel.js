const connection = require('./connection');

const createMessage = async (chatMessage, nickname, timestamp) =>
  connection()
    .then((db) =>
      db.collection('messages').insertOne({ chatMessage, nickname, timestamp }))
    .then(({ insertedId }) => ({
      _id: insertedId,
      chatMessage,
      nickname,
      timestamp,
    }))
    .catch((error) => error);

const getAllMessages = async () =>
  connection()
    .then((db) => db.collection('messages').find({}).toArray());

module.exports = { createMessage, getAllMessages };
