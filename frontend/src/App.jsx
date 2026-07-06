import { useEffect, useState } from 'react';
import AuthForm from './components/AuthForm';
import TaskPage from './pages/TaskPage';
import api from './services/api';

const App = () => {
  const [isAuthView, setIsAuthView] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', mode: 'login' });
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('task-user');
    const token = localStorage.getItem('task-token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      fetchTasks();
    }
  }, []);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!isAuthView || user || !clientId) {
      return;
    }

    let interval = null;

    const renderGoogleButton = () => {
      const googleRoot = window.google;
      const buttonContainer = document.getElementById('google-signin');

      if (googleRoot && googleRoot.accounts && buttonContainer) {
        googleRoot.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback
        });
        googleRoot.accounts.id.renderButton(buttonContainer, {
          theme: 'outline',
          size: 'large',
          width: '100%'
        });

        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }
    };

    renderGoogleButton();

    if (!window.google || !window.google.accounts) {
      interval = window.setInterval(renderGoogleButton, 250);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAuthView, user]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      setError('Unable to load tasks');
    }
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
      const response = await api.post(endpoint, {
        name: form.name,
        email: form.email,
        password: form.password
      });

      const { token, user: authUser } = response.data;
      localStorage.setItem('task-token', token);
      localStorage.setItem('task-user', JSON.stringify(authUser));
      setUser(authUser);
      setForm({ name: '', email: '', password: '', mode: authMode });
      await fetchTasks();
      setIsAuthView(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCallback = async (response) => {
    setError('');
    setLoading(true);

    try {
      const result = await api.post('/auth/google', { idToken: response.credential });
      const { token, user: authUser } = result.data;
      localStorage.setItem('task-token', token);
      localStorage.setItem('task-user', JSON.stringify(authUser));
      setUser(authUser);
      await fetchTasks();
      setIsAuthView(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreate = async (event) => {
    event.preventDefault();
    if (!localStorage.getItem('task-token')) return;

    try {
      const response = await api.post('/tasks', { title: taskText, description: taskDescription, completed: false });
      setTasks([response.data, ...tasks]);
      setTaskText('');
      setTaskDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create task');
    }
  };

  const toggleTask = async (task) => {
    try {
      const updated = await api.put(`/tasks/${task.id}`, { completed: !task.completed });
      setTasks(tasks.map((item) => (item.id === task.id ? updated.data : item)));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete task');
    }
  };

  const logout = () => {
    localStorage.removeItem('task-token');
    localStorage.removeItem('task-user');
    setUser(null);
    setTasks([]);
    setIsAuthView(true);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Task Manager</h1>
          <p>Keep track of your goals with your personal workspace.</p>
        </div>
        {user ? (
          <button className="secondary-btn" onClick={logout}>Logout</button>
        ) : (
          <button className="secondary-btn" onClick={() => setIsAuthView(true)}>
            Login / Register
          </button>
        )}
      </header>

      {error ? <div className="error-box">{error}</div> : null}

      {!user && isAuthView ? (
        <AuthForm
          mode={authMode}
          form={form}
          setForm={(updater) => {
            const next = typeof updater === 'function' ? updater(form) : updater;
            setForm(next);
            if (next.mode) setAuthMode(next.mode);
          }}
          loading={loading}
          onSubmit={handleAuth}
          error={error}
        />
      ) : null}

      {user ? (
        <TaskPage
          user={user}
          tasks={tasks}
          taskText={taskText}
          setTaskText={setTaskText}
          taskDescription={taskDescription}
          setTaskDescription={setTaskDescription}
          handleTaskCreate={handleTaskCreate}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
        />
      ) : null}
    </div>
  );
};

export default App;
