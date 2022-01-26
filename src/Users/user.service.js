const config = require("../config.json");
const jwt = require("jsonwebtoken");
const Role = require("../helpers/Role");

// users hardcoded for simplicity
const users = [
  {
    id: 1,
    username: "admin",
    password: "admin",
    firstName: "Admin",
    lastName: "User",
    role: Role.Admin,
  },
  {
    id: 2,
    username: "contributor",
    password: "contributor",
    firstName: "Normal",
    lastName: "User",
    role: Role.Contributor,
  },
  {
    id: 3,
    username: "guest",
    password: "guest",
    firstName: "guesterino",
    lastName: "User",
    role: Role.Guest,
  },
];

module.exports = {
  authenticate,
  getAll,
  getById,
  logout,
};

tokens = [];

// that was a try function to invalidate the tokens instead it creates another one with different value
async function logout() {
  const tokenized = tokens.length;
  if (tokenized) {
    var things = ["Rock", "Paper", "Scissor"];
    config.secret = things[Math.floor(Math.random() * things.length)];
    const token = jwt.sign("0921", config.secret);
    return token;
  }
}

//this function finds the right user and it creates a token with jwt and merges with the secret also gets the role.
async function authenticate({ username, password }) {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
    tokens.push({ token: token });
    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      token,
    };
  }
}

// those functions are the test functions but they can be acessed with the right api path and authorization
async function getAll() {
  return users.map((u) => {
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  });
}

async function getById(id) {
  const user = users.find((u) => u.id === parseInt(id));
  if (!user) return;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
