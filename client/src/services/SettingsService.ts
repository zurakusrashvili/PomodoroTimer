// settingsService.ts

import axiosCreate from "@/axios";
const axiosInstance = axiosCreate();


export default  {
  getUserSettings() {
    return axiosInstance.get("/settings/getUserSettings")
      .then(response => response.data)
      .catch(err => {
        console.error("Error fetching user settings:", err);
        throw err;
      });
  },

  initialise(settings: { 
    workSessionDuration: number, 
    shortBreakDuration: number, 
    longBreakDuration: number, 
    sessionsBeforeLongBreak: number,
    autoStartBreak: boolean,
    autoStartWorkSession: boolean,
    tickingSoundOn: boolean,
    alarmSoundOn: boolean
  }) {
    return axiosInstance.post("/settings/initialise", settings)
      .then(response => response.data)
      .catch(err => {
        console.error("Error initializing settings:", err);
        throw err;
      });
  },

  updateUserSettings(settings: { 
    workSessionDuration: number, 
    shortBreakDuration: number, 
    longBreakDuration: number, 
    sessionsBeforeLongBreak: number,
    autoStartBreak: boolean,
    autoStartWorkSession: boolean,
    tickingSoundOn: boolean,
    alarmSoundOn: boolean
  }) {

    return axiosInstance.put("/settings/updateUserSettings", settings)
      .then(response => response.data)
      .catch(err => {
        console.error("Error updating user settings:", err);
        throw err;
      });
  }
}
