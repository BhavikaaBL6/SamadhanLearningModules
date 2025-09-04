const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (local)
mongoose.connect('mongodb://localhost:27017/notesapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB connection error:', err));

// Mongoose Model
const Note = mongoose.model('Note', new mongoose.Schema({
    title: String,
    content: String
}, { timestamps: true }));

// API Routes (CRUD)

// Create a note
app.post('/api/notes', async (req, res) => {
    const note = new Note(req.body);
    await note.save();
    res.json(note);
});

// Read all notes
app.get('/api/notes', async (req, res) => {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
});

// Update a note
app.put('/api/notes/:id', async (req, res) => {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(note);
});

// Delete a note
app.delete('/api/notes/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
});

// Serve frontend HTML directly
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Notes App</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 30px auto; padding: 20px; }
        input, textarea { width: 100%; margin: 5px 0; padding: 8px; }
        button { margin-top: 10px; padding: 8px 12px; }
        ul { list-style: none; padding: 0; }
        li { margin: 10px 0; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>📝 Notes App</h1>
    <form id="noteForm">
        <input id="title" placeholder="Title" required><br>
        <textarea id="content" placeholder="Content" required></textarea><br>
        <button type="submit">Add Note</button>
    </form>
    <ul id="notesList"></ul>

    <script>
        const API_URL = '/api/notes';

        async function fetchNotes() {
            const res = await fetch(API_URL);
            const notes = await res.json();
            const list = document.getElementById('notesList');
            list.innerHTML = '';
            notes.forEach(note => {
                const li = document.createElement('li');
                li.innerHTML = \`<strong>\${note.title}</strong><br>\${note.content}<br>
                    <button onclick="deleteNote('\${note._id}')">Delete</button>\`;
                list.appendChild(li);
            });
        }

        async function deleteNote(id) {
            await fetch(\`\${API_URL}/\${id}\`, { method: 'DELETE' });
            fetchNotes();
        }

        document.getElementById('noteForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });
            document.getElementById('noteForm').reset();
            fetchNotes();
        });

        fetchNotes();
    </script>
</body>
</html>
    `);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
