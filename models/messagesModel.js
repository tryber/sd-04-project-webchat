const connection = require('./connection');

const messageSave = async ({ chatMessage, nickname, timestamp }) => {
  try {
    const db = await connection();
    const msg = await db
      .collection('messages')
      .insertOne({ chatMessage, nickname, timestamp });
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

const messageAll = async () => {
  try {
    const db = await connection();
    const allMsg = await db.collection('messages').find({}).toArray();
    return allMsg;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { messageSave, messageAll };
