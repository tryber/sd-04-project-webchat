const connection = require('./connection');

const save = async ({ nickname, chatMessage }) =>
  await connection().then((db) =>
    db
      .collection('messages')
      .insertOne({ nickname, chatMessage, timestamp: new Date().toLocaleString() }),
  );

const getAll = async () => {
  const db = await connection();
  return db.collection('messages').find({}).toArray();
};

module.exports = {
  save,
  getAll,
};
