const connection = require('./connection');

const create = async (chatMessage, nickname, timestamp) =>
  connection()
    .then((db) =>
      db.collection('messages').insertOne({ chatMessage, nickname, timestamp })
    )
    .then(({ insertedId }) => ({
      chatMessage,
      nickname,
      timestamp,
      _id: insertedId,
    }));

const getAll = async () =>
  connection().then((db) => db.collection('messages').find({}).toArray());

const messageModel = { create, getAll };

module.exports = { messageModel };
