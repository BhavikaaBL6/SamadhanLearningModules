const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory "database"
let students = [];
let nextId = 1;

// GET all students
app.get("/students", (req, res) => {
  res.json(students);
});

// GET student by ID
app.get("/students/:id", (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
});

// POST - Add a student
app.post("/students", (req, res) => {
  const { name, age, course } = req.body;

  if (!name || !age || !course) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newStudent = {
    id: nextId++,
    name,
    age: Number(age), // ensure age is stored as a number
    course,
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// PUT - Update a student
app.put("/students/:id", (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const { name, age, course } = req.body;
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  if (name !== undefined) student.name = name;
  if (age !== undefined) student.age = Number(age);
  if (course !== undefined) student.course = course;

  res.json(student);
});

// DELETE - Remove a student
app.delete("/students/:id", (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const index = students.findIndex((s) => s.id === studentId);

  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  const deletedStudent = students.splice(index, 1);
  res.json(deletedStudent[0]);
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Student API running on http://localhost:${PORT}`);
});
