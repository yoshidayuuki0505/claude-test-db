const express = require('express');
const { pool, initDB } = require('./db');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// GET /api/todos
app.get('/api/todos', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
  res.json(rows);
});

// POST /api/todos
app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const { rows } = await pool.query(
    'INSERT INTO todos (title) VALUES ($1) RETURNING *',
    [title.trim()]
  );
  res.status(201).json(rows[0]);
});

// PATCH /api/todos/:id
app.patch('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const fields = [];
  const values = [];
  let i = 1;

  if (title !== undefined) {
    fields.push(`title = $${i++}`);
    values.push(title.trim());
  }
  if (completed !== undefined) {
    fields.push(`completed = $${i++}`);
    values.push(completed);
  }
  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE todos SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
    values
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json(rows[0]);
});

// DELETE /api/todos/:id
app.delete('/api/todos/:id', async (req, res) => {
  const { rows } = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [req.params.id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json({ message: 'Deleted' });
});

if (require.main === module) {
  initDB().then(() => {
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000');
    });
  });
} else {
  initDB();
}

module.exports = app;
