const DB_URI = 
    process.env.NODE_ENV === 'test'
    ? 'postgresql:///bedcorndb_auth_test'
    : 'postgresql:///bedcorndb';

const BCRYPT_WORK_FACTOR = 12;
const SECRET_KEY = process.env.SECRET_KEY || 'pineapplepizza192837648919';
console.log(typeof SECRET_KEY);
module.exports = {DB_URI, BCRYPT_WORK_FACTOR, SECRET_KEY};

