//const config = require('./config/config');
const express = require('express');
const app = express();
app.use(express.static('./to-do/build'));
const Pool = require('pg').Pool;

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// gotta refactor this when i know what im doing

//const dbinfo = config.development.database;

const pool = new Pool();

const createTableString = `
CREATE TABLE IF NOT EXISTS tasks(
  task_id SERIAL PRIMARY KEY,
  task_name VARCHAR(255) NOT NULL,
  is_done boolean NOT NULL DEFAULT false
  );
`;

const qCreateTask = `INSERT INTO tasks (task_name) VALUES ($1) RETURNING *`;
const qGetAllTasks = `SELECT * FROM tasks;`;
const qDeleteTask = `DELETE FROM tasks WHERE task_id = $1`;
const qUpdateTask = `UPDATE tasks SET is_done = $1 WHERE task_id = $2 RETURNING *;`;

function createTask(name, callback) {
  pool.query(qCreateTask, [name], function (err, res) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, res.rows[0]);
    }
  });
}

function getAllTasks(callback) {
  pool.query(qGetAllTasks, function (err, res) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, res.rows);
    }
  });
}

function deleteTask(id, callback) {
  pool.query(qDeleteTask, [id], function (err, res) {
    if(err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

function updateTask(id, isDone, callback) {
  pool.query(qUpdateTask, [isDone, id], function (err, res) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, res.rows[0]);
    }
  });
}

pool.query(createTableString, function (err, res) {
  if (err) {
    console.error(err);
  } else {
    console.log(res);
  }
});

app.get('/', function (req, res) {
  res.send('hello world')
});

app.listen(3000, function() {
  console.log('start');
});

app.put('/api/tasks/', function (req, res) {
  const name = req.body.name;
  createTask(name, function (err, task) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(JSON.stringify(task));
    }
  });
});

app.get('/api/tasks/', function (req, res) {
  getAllTasks(function (err, tasks) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(JSON.stringify(tasks));
    }
  });
});

app.delete('/api/tasks/:id', function (req, res) {
  const id = req.params.id;
  deleteTask(id, function (err) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

app.post('/api/tasks/:id', function (req, res) {
  const id = req.params.id;
  const isDone = req.body.isDone;
  updateTask(id, isDone, function (err, task) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(JSON.stringify(task));
    }
  });
});