import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from "./api";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadTasks() {
    setLoading(true);
    setError("");

    try {
      setTasks(await getTasks());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleAdd(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const task = await createTask(title.trim());
      setTasks((old) => [task, ...old]);
      setTitle("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id, updates) {
    setError("");

    try {
      const updated = await updateTask(id, updates);

      setTasks((old) =>
        old.map((task) => task._id === id ? updated : task)
      );

      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    setError("");

    try {
      await deleteTask(id);
      setTasks((old) => old.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <main className="container"><p>Loading tasks...</p></main>;
  }

  return (
    <main className="container">
      <header>
        <h1>Mini Task Manager</h1>
        <p>Organize your work, one task at a time.</p>
      </header>

      <form onSubmit={handleAdd} className="add-form">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to be done?"
          maxLength={200}
          aria-label="New task title"
        />
        <button disabled={saving}>
          {saving ? "Adding..." : "Add Task"}
        </button>
      </form>

      {error && (
        <p className="error" role="alert">
          {error}
          <button
            type="button"
            className="secondary"
            onClick={() => setError("")}
          >
            Dismiss
          </button>
        </p>
      )}

      <h2>Your Tasks ({tasks.length})</h2>

      {tasks.length === 0 ? (
        <p className="empty">No tasks yet. Add your first task!</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(event) =>
                  handleUpdate(task._id, {
                    completed: event.target.checked
                  })
                }
                aria-label={`Mark ${task.title} as completed`}
              />

              {editingId === task._id ? (
                <form
                  className="edit-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!editTitle.trim()) {
                      setError("Task title cannot be empty.");
                      return;
                    }
                    handleUpdate(task._id, {
                      title: editTitle.trim()
                    });
                  }}
                >
                  <input
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    maxLength={200}
                    aria-label="Edit task title"
                    autoFocus
                  />
                  <button type="submit">Save</button>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => setEditingId(null)}
                  >
                  </button>
                </form>
              ) : (
                <>
                  <span className={task.completed ? "done" : ""}>
                    {task.title}
                  </span>
                  <button
                    className="secondary"
                    onClick={() => {
                      setEditingId(task._id);
                      setEditTitle(task.title);
                    }}
                  >
                    Edit
                  </button>
                </>
              )}

              <button
                className="danger"
                onClick={() => handleDelete(task._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
