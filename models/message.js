const connection = require('./connection');

const addMessage = async (chatMessage, nickname, timestamp) => {
  const message = await connection().then((db) => db.collection('messages').insertOne({ chatMessage, nickname, timestamp }));
  return message;
}; 

const getAllMessages = async () => {
  const allMessages = connection().then((db) => db.collection('messages').find({}).toArray());
  return allMessages;
};

module.exports = {
  addMessage,
  getAllMessages,
};
