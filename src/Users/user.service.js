const config = require('../config.json');
const jwt = require('jsonwebtoken');
const Role = require('../helpers/Role');

// users hardcoded for simplicity, store in a db for production applications
const users = [
    { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin },
    { id: 2, username: 'contributor', password: 'contributor', firstName: 'Normal', lastName: 'User', role: Role.Contributor },
    { id: 3, username: 'guest', password: 'guest', firstName: 'guesterino', lastName: 'User', role: Role.Guest },
];

module.exports = {
    authenticate,
    getAll,
    getById,
    logout,
    
};

tokens = [];


async function logout(){
    
    const tokenized = tokens.length
    if (tokenized){
        
        var things = ['Rock', 'Paper', 'Scissor'];
        config.secret = things[Math.floor(Math.random()*things.length)];
        console.log(config.secret);
        const token = jwt.sign("0921", config.secret);
        console.log(token);
        return token
    
    }
}


async function authenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
        tokens.push({token: token});
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token
        };
    }
}

async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}

async function getById(id) {
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}