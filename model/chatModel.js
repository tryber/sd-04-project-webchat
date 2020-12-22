// const { db } = require('mongodb');
const connection = require('../model/connection');

const getHours = () => {
  const dat = new Date();

  let dateDay = `${dat.getDay()}-${dat.getMonth()}-${dat.getFullYear()}`;
  let datHours = `${dat.getHours()}:${dat.getMinutes()}:${dat.getSeconds()}`;

  let ampm = dat.getHours() < 13 ? 'AM' : 'PM';

  let dateHoursFull = `${dateDay} ${datHours} ${ampm}`;

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

const registeredHistoric = async () => {
  const lastAdded = await connection().then((db) => {
    return db.collection('messages').find().toArray();
  });
  return lastAdded;
};

module.exports = { registerData, registeredHistoric, getHours };
