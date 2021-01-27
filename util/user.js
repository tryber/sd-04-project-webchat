const users = [];

const userAdd = (id, nickname) => {
  const user = { id, nickname };
  users.push(user);
  return user;
};

const getCurrentUser = (id) => users.find((user) => user.id === id);

const changeUser = (id, nickname) => {
  const index = users.findIndex((user) => user.id === id);
  users[index].nickname = nickname;
};

const getAllUsers = () => users;

const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

module.exports = { userAdd, getCurrentUser, changeUser, getAllUsers, userLeave };
