const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// --- In-memory Todo Storage ---
let todos = []; // Each todo: { id, text }
let nextId = 1;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Serve HTML on root route ---
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>To-Do App</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        input { padding: 6px; }
        button { margin-left: 5px; padding: 6px; }
        ul { list-style: none; padding: 0; }
        li { margin: 6px 0; }
        .delete-btn { color: red; cursor: pointer; margin-left: 10px; }
      </style>
    </head>
    <body>
      <h1>To-Do App</h1>
      <input id="todoInput" placeholder="Enter a task..." />
      <button onclick="addTodo()">Add</button>
      <ul id="todoList"></ul>

      <script>
        const API_URL = "/todos";

        // Fetch and render todos
        async function fetchTodos() {
          try {
            const res = await fetch(API_URL);
            const todos = await res.json();
            const list = document.getElementById("todoList");
            list.innerHTML = "";
            todos.forEach(todo => {
              const li = document.createElement("li");
              li.textContent = todo.text;
              const del = document.createElement("span");
              del.textContent = " ❌";
              del.className = "delete-btn";
              del.onclick = () => deleteTodo(todo.id);
              li.appendChild(del);
              list.appendChild(li);
            });
          } catch (err) {
            console.error("Failed to fetch todos:", err);
          }
        }

        // Add todo
        async function addTodo() {
          const input = document.getElementById("todoInput");
          const text = input.value.trim();
          if (!text) return alert("Enter a task!");

          try {
            await fetch(API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text })
            });
            input.value = "";
            input.focus();
            fetchTodos();
          } catch (err) {
            console.error("Failed to add todo:", err);
          }
        }

        // Delete todo
        async function deleteTodo(id) {
          try {
            await fetch(\`\${API_URL}/\${id}\`, { method: "DELETE" });
            fetchTodos();
          } catch (err) {
            console.error("Failed to delete todo:", err);
          }
        }

        // Support "Enter" key to add task
        document.getElementById("todoInput").addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            addTodo();
          }
        });

        // Initial load
        fetchTodos();
      </script>
    </body>
    </html>
  `);
});

// --- API Endpoints ---

// GET all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

// POST a new todo
app.post("/todos", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Text is required" });

  const newTodo = { id: nextId++, text };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// DELETE a todo
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ message: "Todo not found" });

  const deleted = todos.splice(index, 1);
  res.json(deleted[0]);
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`✅ To-Do App running at http://localhost:${PORT}`);
});
