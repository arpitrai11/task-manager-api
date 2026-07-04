const app = document.getElementById('app');

const filters = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

let tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

function render() {
  if (!app) return;

  const visibleTasks = tasks.filter((task) => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  const activeCount = tasks.filter((task) => !task.completed).length;

  app.innerHTML = `
    <div class="min-h-screen bg-slate-100 p-4 text-slate-800 sm:p-6 lg:p-8">
      <div class="mx-auto flex max-w-2xl flex-col gap-4 rounded-3xl bg-white p-6 shadow-xl sm:p-8">
        <header class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Productivity</p>
            <h1 class="text-3xl font-bold">To-Do List</h1>
          </div>
          <span class="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">${activeCount} active</span>
        </header>

        <form id="taskForm" class="flex flex-col gap-3 sm:flex-row">
          <input id="taskInput" type="text" placeholder="What needs to be done?" autocomplete="off" required class="flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-0 focus:border-indigo-500" />
          <button type="submit" class="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700">Add Task</button>
        </form>

        <div class="flex gap-2">
          ${filters
            .map(
              (filter) => `
                <button class="filter-btn rounded-full px-3 py-2 text-sm font-medium ${currentFilter === filter.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}" data-filter="${filter.id}">
                  ${filter.label}
                </button>
              `
            )
            .join('')}
        </div>

        <ul class="flex flex-col gap-2">
          ${visibleTasks.length === 0 ? '<li class="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-slate-500">No tasks to show.</li>' : visibleTasks.map((task) => `
            <li class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3" data-id="${task.id}">
              <label class="flex flex-1 cursor-pointer items-center gap-3">
                <input class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" type="checkbox" ${task.completed ? 'checked' : ''} />
                <span class="task-text ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}">${task.text}</span>
                <input class="task-edit-input hidden flex-1 rounded-xl border border-indigo-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" type="text" value="${task.text}" style="display: none;" />
              </label>
              <div class="flex gap-2">
                <button class="edit-btn text-sm font-medium text-blue-500 hover:text-blue-600" data-action="edit">Edit</button>
                <button class="save-btn hidden text-sm font-medium text-green-500 hover:text-green-600" data-action="save" style="display: none;">Save</button>
                <button class="cancel-btn hidden text-sm font-medium text-gray-500 hover:text-gray-600" data-action="cancel" style="display: none;">Cancel</button>
                <button class="delete-btn text-sm font-medium text-red-500 hover:text-red-600" data-action="delete">Delete</button>
              </div>
            </li>
          `).join('')}
        </ul>

        <div class="flex justify-end">
          <button id="clearCompleted" class="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200">Clear completed</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('taskForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('taskInput');
    const value = input?.value.trim();
    if (!value) return;

    tasks.unshift({ id: Date.now(), text: value, completed: false });
    saveTasks();
    render();
  });

  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      currentFilter = button.getAttribute('data-filter') || 'all';
      render();
    });
  });

  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const item = event.target.closest('li[data-id]');
      if (!item) return;
      const id = Number(item.getAttribute('data-id'));
      tasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task));
      saveTasks();
      render();
    });
  });

  document.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('li[data-id]');
      if (!item) return;
      const id = Number(item.getAttribute('data-id'));
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      render();
    });
  });

  document.querySelectorAll('.edit-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('li[data-id]');
      if (!item) return;

      const taskText = item.querySelector('.task-text');
      const editInput = item.querySelector('.task-edit-input');
      const editBtn = item.querySelector('.edit-btn');
      const saveBtn = item.querySelector('.save-btn');
      const cancelBtn = item.querySelector('.cancel-btn');
      const deleteBtn = item.querySelector('.delete-btn');
      const checkbox = item.querySelector('input[type="checkbox"]');

      taskText.style.display = 'none';
      editInput.style.display = 'block';
      editBtn.style.display = 'none';
      saveBtn.style.display = 'inline-block';
      cancelBtn.style.display = 'inline-block';
      deleteBtn.style.display = 'none';
      checkbox.style.display = 'none';

      editInput.focus();
      editInput.select();
    });
  });

  document.querySelectorAll('.save-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('li[data-id]');
      if (!item) return;
      const id = Number(item.getAttribute('data-id'));
      const editInput = item.querySelector('.task-edit-input');
      const newText = editInput.value.trim();

      if (!newText) {
        alert('Task cannot be empty!');
        return;
      }

      tasks = tasks.map((task) => 
        task.id === id ? { ...task, text: newText } : task
      );
      saveTasks();
      render();
    });
  });

  document.querySelectorAll('.cancel-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('li[data-id]');
      if (!item) return;

      const taskText = item.querySelector('.task-text');
      const editInput = item.querySelector('.task-edit-input');
      const editBtn = item.querySelector('.edit-btn');
      const saveBtn = item.querySelector('.save-btn');
      const cancelBtn = item.querySelector('.cancel-btn');
      const deleteBtn = item.querySelector('.delete-btn');
      const checkbox = item.querySelector('input[type="checkbox"]');

      taskText.style.display = 'inline';
      editInput.style.display = 'none';
      editBtn.style.display = 'inline-block';
      saveBtn.style.display = 'none';
      cancelBtn.style.display = 'none';
      deleteBtn.style.display = 'inline-block';
      checkbox.style.display = 'inline-block';
    });
  });

  document.getElementById('clearCompleted')?.addEventListener('click', () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    render();
  });
}

export function createApp() {
  render();
}
