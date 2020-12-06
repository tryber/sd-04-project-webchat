const connection = require('./connection');

const getAllMessages = async () =>
  connection()
    .then((db) => db.collection('messages').find().toArray())
    .catch((err) => {
      console.log(err);
      throw err;
    });

const insertMessage = async (message) => {
  const savedMessage = await connection
    .then((db) => db.collection('messages'.insertOne({ message })))
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return savedMessage.ops[0];
};

module.exports = {
  getAllMessages,
  insertMessage,
};
