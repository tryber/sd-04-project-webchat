// const { db } = require('mongodb');
const connection = require('./connection');

const getHours = () => {
  const dat = new Date();

  const dateDay = `${dat.getDay()}-${dat.getMonth()}-${dat.getFullYear()}`;
  const datHours = `${dat.getHours()}:${dat.getMinutes()}:${dat.getSeconds()}`;

  const ampm = dat.getHours() < 13 ? 'AM' : 'PM';

  const dateHoursFull = `${dateDay} ${datHours} ${ampm}`;

  return dateHoursFull;
};

// 09-10-2020 2:35:09 PM - Joel: Olá meu caros amigos!

const registerData = (data) => {
  connection().then((db) => {
    db.collection('messages').insertOne({
      nickname: data.nickname,
      chatMessage: data.chatMessage,
      date: `${getHours()}`,
    });
  });
};

const registeredHistoric = async () =>
  await connection().then((db) => {
    return db.collection('messages').find().toArray();
  });

module.exports = { registerData, registeredHistoric, getHours };
