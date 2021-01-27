const connection = require('./connection');

const create = async (messageObj) => {
  try {
    const database = await connection();
    const message = await database.collection('messages').insertOne(messageObj);
    return message.ops[0];
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

const createPrivate = async (messageObj) => {
  try {
    const database = await connection();
    const privateMessage = await database
      .collection('private')
      .insertOne(messageObj);
    return privateMessage.ops[0];
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

const getAll = async () => {
  try {
    const database = await connection();
    const messages = await database.collection('messages').find({}).toArray();
    return messages;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

const messageModel = {
  create,
  createPrivate,
  getAll,
};

module.exports = { messageModel };
