import React, { useEffect, useState } from 'react';
import service from './service.js';
import './App.css'; // במידה ויש קובץ CSS מותאם

function App() {
  const [newTodo, setNewTodo] = useState(''); // משימה חדשה
  const [todos, setTodos] = useState([]); // רשימת המשימות
  const [loading, setLoading] = useState(false); // אינדיקציה לטעינה
  const [error, setError] = useState(null); // אינדיקציה לשגיאות

  // שליפת כל המשימות
  async function getTodos() {
    try {
      setLoading(true);
      const data = await service.getTasks();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // יצירת משימה חדשה
  async function createTodo(e) {
    e.preventDefault();
    if (!newTodo.trim()) {
      alert('Please enter a valid task name.');
      return;
    }

    try {
      await service.addTask({ name: newTodo, isComplete: false });
      setNewTodo(''); // ניקוי השדה
      await getTodos(); // ריענון רשימת המשימות
    } catch (err) {
      setError('Failed to add a new task. Please try again.');
    }
  }

  // עדכון מצב השלמה של משימה
  async function updateCompleted(todo, isComplete) {
    try {
      await service.setCompleted(todo.id, isComplete);
      await getTodos(); // ריענון רשימת המשימות
    } catch (err) {
      setError('Failed to update task. Please try again.');
    }
  }

  // מחיקת משימה
  async function deleteTodo(id) {
    try {
      await service.deleteTask(id);
      await getTodos(); // ריענון רשימת המשימות
    } catch (err) {
      setError('Failed to delete task. Please try again.');
    }
  }

  // שליפת המשימות בעת טעינת הדף
  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="app">
      <section className="todoapp">
        <header className="header">
          <h1>Tasks</h1>
          <form onSubmit={createTodo}>
            <input
              className="new-todo"
              placeholder="Enter a new task"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
          </form>
        </header>
        <section className="main" style={{ display: "block" }}>
          {loading && <p>Loading tasks...</p>}
          {error && <p className="error">{error}</p>}
          <ul className="todo-list">
            {todos.map((todo) => (
              <li className={todo.isComplete ? "completed" : ""} key={todo.id}>
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.isComplete}
                    onChange={(e) => updateCompleted(todo, e.target.checked)}
                  />
                  <label>{todo.name}</label>
                  <button
                    className="destroy"
                    onClick={() => deleteTodo(todo.id)}
                  ></button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </div>
  );
}

export default App;
