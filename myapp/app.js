const express = require('express');
const app = express();
const port = 3000;

tasks= [
  {id : 1, title: 'Task 1', completed: true},
  {id : 2, title: 'Task 2', completed: true},
  {id : 3, title: 'Task 3', completed: false},
]
app.get('/', (req, res) => {
  // res.send('Hello World!');
  res.json(
    {name: 'Task API',
    version: '1.0',
    endpoints: ['/tasks']
  });
});

app.get('/health', (req, res) => {
  res.json({status: 'ok'});
})

app.get('/tasks', (req, res) => {
  res.json(tasks);
})

app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(task => task.id === taskId);
  if (!task) {
    return res.status(404).json({error: 'Task 99 not found'});
  }
  res.json(task);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});