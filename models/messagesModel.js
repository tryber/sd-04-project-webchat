const connection = require('./connection');

const getAll = async () => {
  try {
    const db = await connection();
    const messages = await db.collection('messages').find().toArray();
    return messages;
  } catch (e) {
    return e.message;
  }
}

const add = async (nickname, chatMessage, dateMessage) => {
  try {
    const db = await connection();
    const addMessage = await db.collection('messages').insertOne({ nickname, chatMessage, dateMessage });
    return addMessage.ops[0];
  } catch(err) {
    return err;
  }
}

module.exports = {
  getAll,
  add,
};
