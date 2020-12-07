const connection = require('../tests/helpers/db');

const insertMessage = async (messageObj) => {
  const conn = await connection();
  const message = await conn.collection('messages').insertOne(messageObj);
  return message.ops[0];
};

module.exports = {
  insertMessage,
};
