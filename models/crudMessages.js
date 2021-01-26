const connection = require('./connection');

const createMessage = async (messageInfo) => {
  try {
    const database = await connection();
    const message = await database.collection('messages').insertOne(messageInfo);
    return message.ops[0];
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

const getAllMessages = async () => {
  try {
    const database = await connection();
    const messages = await database.collection('messages').find({}).toArray();
    return messages;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

module.exports = {
  createMessage,
  getAllMessages,
};
