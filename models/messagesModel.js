const connection = require('./connection');

const saveMessages = async ({ chatMessage, nickname, timestamp }) => {
  try {
    const db = await connection();
    const msg = await db.collection('messages').insertOne({ chatMessage, nickname, timestamp });
    const { insertId: _id } = msg;
    const result = {
      _id,
      chatMessage,
      nickname,
      timestamp,
    };
    return result;
  } catch (error) {
    console.error(error);
  }
};

const allMessages = async () => {
  const db = await connection();
  const result = await db.collection('messages').find({}).toArray();
  return result;
};

module.exports = {
  saveMessages,
  allMessages,
};
