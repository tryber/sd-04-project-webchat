function getTime() {
  const now = new Date();
  const day = now.getDay();
  const month = now.getMonth();
  const year = now.getFullYear();

  const hour = now.getHours();
  const minuts = now.getMinutes();
  const seconds = now.getSeconds();

  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formatDay = day <= 10 ? `0${day}` : day;

  const createOn = `${formatDay}-${month}-${year} ${hour}:${minuts}:${seconds} ${ampm}`;
  return createOn;
}

module.exports = getTime;
