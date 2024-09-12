const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { ObjectId } = require('mongodb');
const connectToMongoDB = require('./dbcon');

const app = express();
const port = 3000;
let collection;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

connectToMongoDB().then((db) => {
  collection = db.collection('tasks');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/add', async (req, res) => {
  const { taskName } = req.body;
  try {
    await collection.insertOne({ taskName, completed: false });
    res.json({ message: 'Task added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add task', error });
  }
});

app.get('/view', async (req, res) => {
  try {
    const tasks = await collection.find().toArray();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error });
  }
});

app.put('/edit/:id', async (req, res) => {
  const taskId = req.params.id;
  const { taskName } = req.body;
  try {
    const result = await collection.updateOne({ _id: new ObjectId(taskId) }, { $set: { taskName } });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error });
  }
});

app.delete('/delete/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    const result = await collection.deleteOne({ _id: new ObjectId(taskId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error });
  }
});

app.put('/complete/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    const result = await collection.updateOne({ _id: new ObjectId(taskId) }, { $set: { completed: true } });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task marked as complete' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark task as complete', error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
