const express = require('express');
const path = require('path');
const notes = require('./db/db.json')
const uuid = require('./helpers/uuid');
// Helper method for generating unique ids


const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON
app.use(express.json()); //content: application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const fs = require("fs");

// starting on home page
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
// on clickin on start notes, user enter into new page for taking notes
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


//API GET request
app.get("/api/notes", (req, res) => {
  // Send read data to response of 'GET' request
  res.json(notes);
});

app.post("/api/notes", (req, res) => {

  // Extracted new note from request body.  
  const newNote = req.body;
  const newNoteid = uuid()
  newNote.id = newNoteid
  // Pushed new note in notes file 'db.json'
  notes.push(newNote);

  const pushNote = JSON.stringify(notes);
  // Written notes data to 'db.json' file
  fs.writeFile(path.join(__dirname, `./db/db.json`), pushNote, (err) => {

    if (err) {
      console.error(err)
    }
  })
  // Send response
  res.status(201).json(notes);
});

app.delete('/api/notes/:id', (req, res) => {
  const id = (req.params.id);

  const noteIndex = notes.findIndex(p => {
    // console.log(p.id)
    // console.log(id)
    return p.id == id
  });

  notes.splice(noteIndex, 1);
  const deleteNote = JSON.stringify(notes);
  // console.log(notes)
  // console.log(noteIndex)

  // Written notes data to 'db.json' file
  fs.writeFile(path.join(__dirname, `./db/db.json`), deleteNote, (err) => {

    if (err) {
      console.error(err)
    }
  })

  return res.send();
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
