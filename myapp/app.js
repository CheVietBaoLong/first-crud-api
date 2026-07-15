const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json')
const port = 3000;


app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openapi)
);

app.use(express.json());

let tasks= [
  {id : 1, title: 'Task 1', completed: true},
  {id : 2, title: 'Task 2', completed: true},
  {id : 3, title: 'Task 3', completed: false},
]
app.get('/', (req, res) => {
  // res.send('Hello World!');
  res.status(200).json(
    {name: 'Task API',
    version: '1.0',
    endpoints: ['/tasks']
  });
});

app.get('/health', (req, res) => {
  res.json({status: 'ok'});
})

app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
})

app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(task => task.id === taskId);
  if (!task) {
    return res.status(404).json({error: 'Task 99 not found'});
  }
  res.status(200).json(task);
});

app.post('/tasks', (req,res) => {
  const {title} = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({error: 'Title is required'});
  }
  const newTask = {
    id: tasks.length + 1,
    title: title,
    done: false
  }
  tasks.push(newTask);
  res.status(201).json(newTask);
})

app.put('/tasks/:id', (req,res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(task => task.id === taskId);
  
  
  // console.log(req.body);
  // console.log(typeof req.body.done);

  //Unknown ID
  if (!task) {
    res.status(404).json({error: 'Task not found'});
  }
  
  const {title, done} = req.body;

  // Empty body
  if (title === undefined && done === undefined) {
    res.status(400).json({error: 'Title or done is required'});
  };

  //Invalid title
  if (title !== undefined && (title.trim() === '' || typeof title !== 'string')) {
    res.status(400).json({error: 'Title cannot be empty'});
  }

  //Invalid done
  if (done !== undefined && typeof done !== 'boolean') {
    res.status(400).json({error: 'Done must be a boolean'});
  }
  if (title !== undefined) {
    task.title = title;
  }
  if (done !== undefined) {
    task.done = done;
  }
  res.json(task);
});


app.delete('/tasks/:id', (req,res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(task => task.id === taskId);

  if (!task) {
    res.status(404).json({error: 'Task not found'});
  }

  tasks = tasks.filter(task => task.id !== taskId);

  //We can use filter for splice in java, like del in python
  //const taskIndex = tasks.findIndex(task => task.id === id)
  //tasks.splice(taskIndex, 1);
  res.status(204).json({message: 'Task deleted successfully'});
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});