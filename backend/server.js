const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const app = express();

const url = 'mongodb://localhost:27017';
const dbName = 'todoapp';

let db;

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Connected to MongoDB');

  db = client.db(dbName);
});

app.use(bodyParser.json());



// API routes

app.get('/todos', (req, res) => {
  db.collection('todos')
    .find()
    .toArray((err, todos) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }

      res.json(todos);
    });
});

app.post('/todos', (req, res) => {
  const newTodo = req.body;

  db.collection('todos').insertOne(newTodo, (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    res.json(result.ops[0]);
  });
});

app.put('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  const updatedTodo = req.body;

  db.collection('todos').updateOne(
    { _id: ObjectId(todoId) },
    { $set: updatedTodo },
    (err) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    }
  );
});

app.delete('/todos/:id', (req, res) => {
  const todoId = req.params.id;

  db.collection('todos').deleteOne({ _id: ObjectId(todoId) }, (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    res.sendStatus(204);
  });
});



const PORT =  3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});