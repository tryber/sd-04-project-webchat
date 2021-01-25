function getTime() {
  const dateNow = new Date();
  const day = dateNow.getDate();
  const month = dateNow.getMonth() + 1;
  const year = dateNow.getFullYear();

  const hour = dateNow.getHours();
  const minuts = dateNow.getMinutes();
  const seconds = dateNow.getSeconds();

  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formatDay = day <= 10 ? `0${day}` : day;

  const createOn = `${formatDay}-${month}-${year} ${hour}:${minuts}:${seconds} ${ampm}`;
  return createOn;
}

module.exports = getTime;
