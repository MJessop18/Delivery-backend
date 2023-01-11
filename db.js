const {Client} = require ('pg/lib');
const {DB_URI} = require ('./config');

const client = new Client ({
    connectionstring: DB_URI 
});

client.connect();
module.exports = client;