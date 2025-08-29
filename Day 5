const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory student list
let students = [
  { id: 1, name: "Aarav", grade: "A" },
  { id: 2, name: "Bhavika", grade: "A+" },
  { id: 3, name: "Kiran", grade: "B" }
];

// Root route to avoid "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Welcome to the Student API!');
});

// GET route to return student list
app.get('/api/students', (req, res) => {
  res.json(students);
});

// POST route to add a new student
app.post('/api/students', (req, res) => {
  const { name, grade } = req.body;
  if (!name || !grade) {
    return res.status(400).json({ error: "Name and grade are required" });
  }

  const newStudent = {
    id: students.length + 1,
    name,
    grade
  };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
