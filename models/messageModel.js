// const { ObjectId } = require('mongodb');
require('dotenv').config();
const dayjs = require('dayjs');
const connection = require('./connection');

const getAllMessages = async () => {
  try {
    const db = await connection();
    const allMessages = await db
      .collection('messages')
      .find({})
      .toArray();
    return allMessages;
  } catch (err) {
    console.log('Error', err);
  }
};

const storeMessage = async (nickname, chatMessage) => {
  try {
    const dateToStore = dayjs(new Date()).format('DD-MM-YYYY hh:mm:ss');
    const db = await connection();
    await db.collection('messages').insertOne({
      nickname,
      chatMessage,
      created_on: dateToStore,
    });
    const messageReady = `${dateToStore} - ${nickname}: ${chatMessage}`;
    return messageReady;
  } catch (err) {
    console.log('Error', err);
  }
};

module.exports = {
  getAllMessages,
  storeMessage,
};
