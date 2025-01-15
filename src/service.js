import axios from 'axios';

// הגדרת כתובת ה-API כברירת מחדל
axios.defaults.baseURL = process.env.REACT_APP_API;
const apiUrl = process.env.REACT_APP_API;

// הוספת Interceptor לטיפול בשגיאות
apiUrl.interceptors.response.use(
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
      const result = await axios.get(`${apiUrl}`);
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
      const result = await axios.post(`${apiUrl}`, newTask);
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
      const result = await axios.put(`${apiUrl}/${id}`, updatedTask);
      return result.data;
    } catch (error) {
      console.error('Failed to update task status', error);
      throw error;
    }
  },

  // מחיקת משימה
  deleteTask: async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete task', error);
      throw error;
    }
  }
};

export default apiService;
