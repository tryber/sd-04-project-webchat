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

const registerData = (data, date) => {
  connection().then((db) => {
    db.collection('messages').insertOne({
      nickname: data.nickname,
      chatMessage: data.chatMessage,
      date,
    });
  });
};

const registerNames = (name, idSocket) => {
  connection().then((db) => {
    db.collection('names').insertOne({ name, idSocket });
  });
};

const eraseNames = (idSocket) => {
  connection().then((db) => {
    db.collection('names').remove({ idSocket });
  });
};

const registeredNames = () =>
  connection().then((db) => db.collection('names').find().toArray());

const registeredHistoric = async () =>
  connection().then((db) => db.collection('messages').find().toArray());

module.exports = {
  registerData,
  registeredHistoric,
  getHours,
  registerNames,
  registeredNames,
  eraseNames,
};
