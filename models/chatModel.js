const connection = require('./connection');

const getMessages = async () =>
  connection().then((db) => db.collection('messages').find({}).toArray());

const saveMessage = async (message, nickname, date) => {
  const result = await connection().then((db) =>
    db.collection('messages').insertOne({ message, nickname, date }));

  return result.ops[0];
};

module.exports = { getMessages, saveMessage };
