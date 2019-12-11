const app = require('express')();
const Pool = require('pg').Pool;

app.get('/', function (req, res) {
  res.send('test');
});

app.listen(3000, function() {
  console.log('start');
});

const npool = new Pool({
  user: 'postgres',
  host: 'postgres.localhost',
  database: 'postgres',
  password: 'local',
  port: 5432,
});

npool.query('SELECT NOW()', function (err, res) {
  console.log('pg test');
  console.log(res);
  npool.end();
});