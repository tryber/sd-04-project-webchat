const connection = require('./connection');

const newMessage = async (chatMessage, nickname, timestamp) => {
  const insertMsg = await connection().then((db) =>
    db.collection('messages').insertOne({ chatMessage, nickname, timestamp }));
  return { message: insertMsg.ops[0] };
};

const findMsg = async () => {
  const allMessages = await connection().then((db) =>
    db.collection('messages').find({}).toArray());
  return allMessages;
};

module.exports = {
  newMessage,
  findMsg,
};
