const users = [];

const userAdd = (id, nickname) => {
  const user = { id, nickname };
  users.push(user);
  return user;
};

const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

const changeUser = (id, nickname) => {
  users.forEach((user) => {
    if (user.id === id) user.nickname = nickname;
  });
};

const getAllUsers = () => {
  return users;
};

const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

module.exports = { userAdd, getCurrentUser, changeUser, getAllUsers, userLeave };
