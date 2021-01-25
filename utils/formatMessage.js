
const date = new Date();
const day = date.getDate();
const month = date.getMonth();
const year = date.getFullYear();
const time = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date);

const formatMessage = (user, message) => {
  return `${day}-${month}-${year} ${time} ${user}: ${message}`;
};

module.exports = formatMessage;
