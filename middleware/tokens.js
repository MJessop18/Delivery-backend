const jwt = require ('jsonwebtoken');
const {SECRET_KEY} = require ('../config');
console.log(SECRET_KEY);

function createToken (user){
    console.search(user.id !== undefined, 'create token was passed to a user without an ID property');

    let payload = {userId:user.id};
    return jwt.sign(payload, SECRET_KEY);
}

module.exports = {createToken};

