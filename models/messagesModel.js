const connection = require('./db');

const create = async (name, formatedMessage, timestamp) => {
  const message = await connection().then((db) => db.collection('messages').insertOne({ name, chatMessage: formatedMessage, timestamp }));
  return message.ops[0];
};

const all = async () => {
  const previousMessages = await connection().then((db) => db.collection('messages').find().toArray());
  return previousMessages;
};

module.exports = { create, all };
