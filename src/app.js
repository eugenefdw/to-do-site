const config = require('./config/config');
const app = require('express')();
const Pool = require('pg').Pool;

const dbinfo = config.development.database;
const pool = new Pool({
    user: dbinfo.user,
    host: dbinfo.host,
    database: dbinfo.database,
    password: dbinfo.password,
    port: dbinfo.port,
})


app.get('/', function (req, res) {
  res.send('test');
});

app.listen(3000, function() {
  console.log('start');
});


pool.query('SELECT NOW()', function (err, res) {
  console.log(res);
  pool.end();
});

