import axiosCreate from "@/axios";
const axiosInstance = axiosCreate();

export default {
  getTimerStateByUser() {
    console.log("shemovidaaaaaaaaaaa")
    return axiosInstance.get("/timerState/getTimerStateByUser")
      .then(response => response.data)
      .catch(err => {
        console.log("Error fetching timer state for user:", err);
      });
  },

  saveOrUpdateTimerState(timerData: {
    timerType: number, 
    taskId: number, 
    secondsRemaining: number
  }) {
    return axiosInstance.post("/timerState/saveOrUpdateTimerState", timerData)
      .then(response => response.data)
      .catch(err => {
        console.error("Error saving or updating timer state:", err);
      });
  }
}
