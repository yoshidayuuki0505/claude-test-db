const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const emailInput = document.getElementById('email-input');
const list = document.getElementById('todo-list');

async function fetchTodos() {
  const res = await fetch('/api/todos');
  const todos = await res.json();
  renderTodos(todos);
}

function renderTodos(todos) {
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id, !todo.completed));

    const span = document.createElement('span');
    span.textContent = todo.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '\u00d7';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.append(checkbox, span, deleteBtn);
    list.appendChild(li);
  });
}

async function addTodo(title, email) {
  const body = { title };
  if (email) body.email = email;
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  fetchTodos();
}

async function toggleTodo(id, completed) {
  await fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  fetchTodos();
}

async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' });
  fetchTodos();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (title) {
    addTodo(title, emailInput.value.trim());
    input.value = '';
  }
});

fetchTodos();
