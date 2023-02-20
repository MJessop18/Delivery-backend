//const DB_URI = 'postgresql://bedcorndb';

const BCRYPT_WORK_FACTOR = 12;
const SECRET_KEY = process.env.SECRET_KEY || '628173b40f43ec4abd62f34296c97353cc31ddacc2aaae203fb3a8dfde2b48dccae7a40062782937719a2a6721eac099f322105e0bf3d10b783e107d96c47722';
console.log(typeof SECRET_KEY);
module.exports = {BCRYPT_WORK_FACTOR, SECRET_KEY};

