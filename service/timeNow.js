function getTime() {
  let now = new Date();
  let day = now.getDay();
  let month = now.getMonth();
  let year = now.getFullYear();

  let hour = now.getHours();
  let minuts = now.getMinutes();
  let seconds = now.getSeconds();

  let ampm = hour >= 12 ? 'PM' : 'AM';
  let formatDay = day <= 10 ? `0${day}` : day;

  let createOn = `${formatDay}-${month}-${year} ${hour}:${minuts}:${seconds} ${ampm}`;
  return createOn;
}

module.exports = getTime;
