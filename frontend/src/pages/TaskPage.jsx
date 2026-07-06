const TaskPage = ({ user, tasks, taskText, setTaskText, taskDescription, setTaskDescription, handleTaskCreate, toggleTask, deleteTask }) => (
  <section className="card task-card">
    <div className="task-head">
      <h2>Welcome back, {user.name}</h2>
      <p>These are your tasks.</p>
    </div>
    <form onSubmit={handleTaskCreate} className="task-form">
      <input type="text" placeholder="Task title" value={taskText} onChange={(e) => setTaskText(e.target.value)} />
      <input type="text" placeholder="Description" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
      <button className="primary-btn" type="submit">Add Task</button>
    </form>

    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={`task-item ${task.completed ? 'done' : ''}`}>
          <label>
            <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task)} />
            <span>{task.title}</span>
          </label>
          <div className="task-actions">
            <span>{task.description || ''}</span>
            <button className="danger-btn" onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

export default TaskPage;