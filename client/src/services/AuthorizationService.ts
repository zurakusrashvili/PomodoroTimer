import axiosCreate from "@/axios";
const axiosInstance = axiosCreate();

export default {
  login(user: { email: string; password: string }) {
    return axiosInstance.post("/users/login", user)
      .then(response => response.data)
      .catch(err => {
        console.error("Error during login:", err);
        throw err;
      });
  },

  register(user: { email: string; password: string; username: string }) {
    return axiosInstance.post("/users/register", user)
      .then(response => response.data)
      .catch(err => {
        console.error("Error during registration:", err);
        throw err;
      });
  },

  logout(){
    return axiosInstance.get('/users/logout').then(response => response.data).catch(err => console.error(err))
  }
};
