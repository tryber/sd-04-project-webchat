const connection = require('./connection');

const getAll = async () => connection().then((db) => db.collection('chats').find().toArray());

const add = async (nickname, chatMessages) => {
  const result = await connection().then((db) =>
    db.collection('chats').insertOne({ nickname, chatMessages }));
  return result.ops[0];
};

module.exports = {
  add,
  getAll,
};
