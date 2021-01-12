const connection = require('./connection');

const getAll = async () => connection().then((db) => db.collection('chat').find().toArray());

const add = async (message) => {
  const result = await connection().then((db) =>
    db.collection('chat').insertOne({ message }));
  return result.ops[0];
};

const addMessages = async (message) => {
  await connection().then((db) =>
    db.collection('messages').insertOne({ message }));
};

module.exports = {
  add,
  getAll,
  addMessages,
};
