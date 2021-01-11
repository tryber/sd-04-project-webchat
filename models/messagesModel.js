const connection = require('./connection');

const getAll = async () => connection().then((db) => db.collection('chat').find().toArray());

const add = async (message) => {
  const result = await connection().then((db) =>
    db.collection('chat').insertOne({ message }));
  return result.ops[0];
};

const addMessages = async (nickname, message, timestamp) => {
  await connection().then((db) =>
    db.collection('messages').insertOne({ nickname, message, timestamp }));
};

module.exports = {
  add,
  getAll,
  addMessages,
};
