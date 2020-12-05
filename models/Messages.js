const connection = require('./connection');

const insertValues = async (nickname, message) => {
  const d = new Date();

  function hoursWithoutZeroes(dt) {
    return dt.getHours() % 12 || 12;
  }

  const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();

  const hour = hoursWithoutZeroes(d);
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const sigla = d.getHours() > 12 ? 'PM' : 'AM';

  const date = `${day}-${month}-${year} ${hour}:${minutes}:${seconds} ${sigla}`;

  const data = await connection().then((db) =>
    db.collection('messages').insertOne({ nickname, message, date }));

  return data.ops[0];
};

module.exports = {
  insertValues,
};
