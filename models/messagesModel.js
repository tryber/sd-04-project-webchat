const connection = require('./connection');

const getAllMessages = async () => connection()
  .then((db) => db.collection('messages').find({}).toArray())
  .catch((err) => {
    console.log(err);
    throw err;
  });

const sendMessage = async (chatMessage, nickname, timestamp) => connection()
  .then((db) => db.collection('messages').insertOne({ chatMessage, nickname, timestamp }))
  .then(({ insertedId }) => ({
    _id: insertedId,
    chatMessage,
    nickname,
    timestamp,
  }));

module.exports = {
  getAllMessages,
  sendMessage,
};
