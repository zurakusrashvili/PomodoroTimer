import timerType from "../types/timerTypes";
import { createStore } from "vuex";
import SettingsService from "@/services/SettingsService";

export default createStore({
  state: {
    user: null,
    loggedIn: false,
    jwtSessionToken: null,
    currentTimerType: timerType.workSession,
    tasks: [],
    currentTask: null,
    timerSettings: {
      workSessionDuration: 25 * 60,
      shortBreakDuration: 5 * 60,
      longBreakDuration: 15 * 60,
      autoStartBreak: false,
      autoStartWorkSession: false,
      tickingSoundOn: false,
      alarmSoundOn: false,
      sessionsBeforeLongBreak: 4
    }, 
    timerState: null
  },
  getters: {
    currentTask: state => state.currentTask,
    timerState: state => state.timerState,
    user: state => state.user,
    timerSettings: state => state.timerSettings,
    autoStartBreak: state => state.timerSettings.autoStartBreak,
    autoStartWorkSession: state => state.timerSettings.autoStartWorkSession,
    currentTimer: state => state.currentTimerType,
    loggedIn: state => state.loggedIn,
    tasks: state => state.tasks,
    workSessionDuration: state => {
      state.timerSettings.workSessionDuration
    },
    shortBreakDuration: state => state.timerSettings.shortBreakDuration,
    longBreakDuration: state => state.timerSettings.longBreakDuration,
  },
  mutations: {
    setCurrentTask: (state, task) => {
      state.currentTask = task;
    },
    setTimerState(state, timerState){
      state.timerState = timerState
    },
    setUser(state, user) {
      state.user = user;
    },
    logToken(state, jwtSessionToken) {
      state.jwtSessionToken = jwtSessionToken;
      state.loggedIn = !!jwtSessionToken;
    },
    setTimerType(state, timerType) {
      state.currentTimerType = timerType;
    },
    updateTimerSettings(state, payload) {
      state.timerSettings = { ...state.timerSettings, ...payload };
      console.log("Updated Timer Settings:", state.timerSettings);
    },
    setLoggedIn(state, isLoggedIn) {
      state.loggedIn = isLoggedIn;
    },
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    updateCurrentTask(state, updatedTask) {
      state.currentTask = updatedTask;
    }
  },
  actions: {
    async setUser(context, user) {
      context.commit("setUser", user);
      if (user) {
        await context.dispatch('loadTimerSettingsFromServer');
      }else{
        const timerSettings = JSON.stringify(localStorage.getItem("timerSettings") || null)
        if(timerSettings){
          this.commit('updateTimerSettings', timerSettings);
        }
      }
    },
    async loadTimerSettingsFromServer({ commit }) {
      try {
        const response = await SettingsService.getUserSettings();
        const data = response.data;
        commit('updateTimerSettings', data);
      } catch (error) {
        console.error("Failed to load timer settings:", error);
      }
    },
    setToken({ commit }, jwtSessionToken) {
      commit("logToken", jwtSessionToken);
    },
    setTimerType({ commit }, timerType) {
      commit("setTimerType", timerType);
    },
    setLoggedIn({ commit }, isLoggedIn) {
      commit("setLoggedIn", isLoggedIn);
    },
    setTasks({ commit }, tasks) {
      commit("setTasks", tasks);
    },
    setTimerState({ commit }, timerState) {
      commit("setTimerState", timerState);
    }
  },
  modules: {},
});