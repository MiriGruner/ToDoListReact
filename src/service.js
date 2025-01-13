import axios from 'axios';

// הגדרת כתובת ה-API כברירת מחדל
const apiClient = axios.create({
  baseURL: "https://localhost:5234", // עדכני את ה-port אם צריך
  timeout: 5000, // הגדרת Timeout של 5 שניות
});

// הוספת Interceptor לטיפול בשגיאות
apiClient.interceptors.response.use(
  response => response, // החזרת התשובה במקרה של הצלחה
  error => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error); // החזרת השגיאה לטיפול נוסף
  }
);

const apiService = {
  // שליפת כל המשימות
  getTasks: async () => {
    try {
      const result = await apiClient.get('/items');
      return result.data;
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      throw error;
    }
  },

  // הוספת משימה חדשה
  addTask: async (name) => {
    try {
      const newTask = { name, isComplete: false };
      const result = await apiClient.post('/items', newTask);
      return result.data;
    } catch (error) {
      console.error('Failed to add task', error);
      throw error;
    }
  },

  // עדכון מצב המשימה (סימון כבוצע/לא בוצע)
  setCompleted: async (id, isComplete) => {
    try {
      const updatedTask = { isComplete };
      const result = await apiClient.put(`/items/${id}`, updatedTask);
      return result.data;
    } catch (error) {
      console.error('Failed to update task status', error);
      throw error;
    }
  },

  // מחיקת משימה
  deleteTask: async (id) => {
    try {
      await apiClient.delete(`/items/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete task', error);
      throw error;
    }
  }
};

export default apiService;
