import axiosCreate from "@/axios";
const axiosInstance = axiosCreate();

export default {
  getUserTasks() {
    return axiosInstance.get("/tasks/getUserTasks")
      .then(response => response.data)
      .catch(err => {
        console.error("Error fetching user tasks:", err);
        throw err;
      });
  },

  getTaskById(taskId: number) {
    return axiosInstance.get(`/tasks/${taskId}`)
      .then(response => response.data)
      .catch(err => {
        console.error("Error fetching task by ID:", err);
        throw err;
      });
  },

  addTask(task: { 
    description: string, 
    sessions: number, 
    completedSessions: number 
  }) {
    return axiosInstance.post("/tasks/add", task)
      .then(response => response.data)
      .catch(err => {
        console.error("Error adding task:", err);
        throw err;
      });
  },

  updateTask(taskId: number, task: { 
    description: string, 
    sessions: number, 
    completedSessions: number 
  }) {
    return axiosInstance.put(`/tasks/update/${taskId}`, task)
      .then(response => response.data)
      .catch(err => {
        console.error("Error updating task:", err);
        throw err;
      });
  },

  deleteTask(taskId: number) {
    return axiosInstance.delete(`/tasks/delete/${taskId}`)
      .then(response => response.data)
      .catch(err => {
        console.error("Error deleting task:", err);
        throw err;
      });
  }
};
