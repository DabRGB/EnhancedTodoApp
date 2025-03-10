import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);

  // Add a new task
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  // Edit a task
  const startEditing = (id, text) => {
    setEditingTaskId(id);
    setEditedText(text);
  };

  const saveEdit = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: editedText } : task
    ));
    setEditingTaskId(null);
  };

  // Toggle task completion
  const toggleCompletion = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Load theme preference on app load
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  return (
    <div className={`container ${darkMode ? 'darkContainer' : ''}`}>
      <div className="header">
        <h1 className={`title ${darkMode ? 'darkText' : ''}`}>Enhanced To-Do List</h1>
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          <span className="slider"></span>
        </label>
      </div>

      <input
        type="text"
        className={`input ${darkMode ? 'darkInput' : ''}`}
        placeholder="Add a new task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addTask()}
      />

      <div className="filterButtons">
        <button
          className={`filterButton ${filter === 'all' ? 'activeFilter' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filterButton ${filter === 'completed' ? 'activeFilter' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button
          className={`filterButton ${filter === 'pending' ? 'activeFilter' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
      </div>

      <ul className="taskList">
        {filteredTasks.map(task => (
          <li key={task.id} className={`taskItem ${task.completed ? 'completedTask' : ''}`}>
            {editingTaskId === task.id ? (
              <input
                type="text"
                className={`editInput ${darkMode ? 'darkInput' : ''}`}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && saveEdit(task.id)}
              />
            ) : (
              <span className={`taskText ${darkMode ? 'darkText' : ''}`}>{task.text}</span>
            )}
            <div className="taskActions">
              <button onClick={() => startEditing(task.id, task.text)}>✏️</button>
              <button onClick={() => toggleCompletion(task.id)}>
                {task.completed ? '✅' : '⬜'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;