const { Client } = require('pg');
 
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'admin',
  database: 'deliverydb'
})


client.connect((err) => {
  if(err) {
    console.error('connection error', err.stack)
  }else{console.log('connected')
}
});
module.exports = client;