<template>
  <v-card :class="['timer__wrapper']">
    <v-tabs background-color="transparent" color="white" class="timer__tabs" v-model="timerType" @click="(tabs) => {
      changeTabs(timerType);
    }
      " active-class="timerType__tabs__selected">
      <v-tab> Work Session</v-tab>
      <v-tab> Short Break</v-tab>
      <v-tab> Long Break</v-tab>
    </v-tabs>

    <v-window v-model="timerType">
      <v-window-item :value="0">
        <app-timer :initialTimeInSeconds="getWorkingSession" :key="getWorkingSession" ref="workSessionTimer" @timeFinished="switchToNextTab">
        </app-timer>
      </v-window-item>

      <v-window-item :value="1">
        <app-timer :initialTimeInSeconds="getShortTime" :key="getShortTime" ref="shortTimer" @timeFinished="switchToNextTab">
        </app-timer>
      </v-window-item>

      <v-window-item :value="2">
        <app-timer :initialTimeInSeconds="getLongTime" :key="getLongTime" ref="longTimer" @timeFinished="switchToNextTab">
        </app-timer>
      </v-window-item>
    </v-window>
  </v-card>
</template>


<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import AppTimer from "./AppTimer.vue";
import timerType from "../types/timerTypes";
import TasksService from "@/services/TasksService";

export default defineComponent({
  name: "PomodoroTimer",
  components: {
    AppTimer,
  },
  data: () => ({
    tab: timerType.workSession,
  }),
  props: {},
  $refs: {
    workSessionTimer: AppTimer,
    shortTimer: AppTimer,
    longTimer: AppTimer,
  },

  watch: {
    getWorkingSession(newVal, oldVal) {
      if (newVal !== oldVal && this.timerType === timerType.workSession) {
        this.$refs.workSessionTimer.restartInitialTime();
      }
    },
    getShortTime(newVal, oldVal) {
      if (newVal !== oldVal && this.timerType === timerType.shortBreak) {
        this.$refs.shortTimer.restartInitialTime();
      }
    },
    getLongTime(newVal, oldVal) {
      if (newVal !== oldVal && this.timerType === timerType.longBreak) {
        this.$refs.longTimer.restartInitialTime();
      }
    }
  },

  methods: {
    changeTabs(val: any) {
      console.log((this.$refs.longTimer as InstanceType<typeof AppTimer>)?.stopTime())
      this.$store.dispatch("setTimerType", val);
      switch (val) {
        case 0:
          (this.$refs.shortTimer as InstanceType<typeof AppTimer>)?.stopTime();
          (this.$refs.longTimer as InstanceType<typeof AppTimer>)?.stopTime();
          break;
        case 1:
          (
            this.$refs.workSessionTimer as InstanceType<typeof AppTimer>
          )?.stopTime();
          (this.$refs.longTimer as InstanceType<typeof AppTimer>)?.stopTime();
          break;
        case 2:
          (
            this.$refs.workSessionTimer as InstanceType<typeof AppTimer>
          )?.stopTime();
          (this.$refs.shortTimer as InstanceType<typeof AppTimer>)?.stopTime();
          break;
      }
    },
    endWorkingSession() {
      if (this.$store.getters.currentTask && this.timerType == timerType.workSession) {
        this.$store.getters.currentTask.completedSessions++;

        this.$store.commit('updateCurrentTask', this.$store.getters.currentTask);

        TasksService.updateTask(this.$store.getters.currentTask?.id, this.$store.getters.currentTask)
          .then(response => {
            console.log("Update task response:", response);
          })
          .catch(err => {
            console.error("Error updating task on working session end:", err);
          });
      } else {
        console.log("No currentTask in the store");
      }
    },

    switchToNextTab() {
      if (this.timerType === timerType.workSession && !this.$store.getters.autoStartBreak) {
        return;
      }
     
      this.endWorkingSession();

      const completedSessions = this.$store.getters.currentTask?.completedSessions;
      const sessionsBeforeLongBreak = this.$store.getters.timerSettings.sessionsBeforeLongBreak;

      if(completedSessions == this.$store.getters.currentTask?.sessions){
        this.changeTabs(timerType.shortBreak)
        return;
      }
      

      if (this.timerType !== timerType.longBreak && completedSessions && completedSessions % sessionsBeforeLongBreak === 0 ) {
        this.timerType = timerType.longBreak;
      } else {
        this.timerType = this.timerType === timerType.workSession ? timerType.shortBreak : timerType.workSession;
      }

      this.changeTabs(this.timerType)

      if (this.timerType === timerType.workSession && this.$store.getters.autoStartWorkSession) {
        this.$refs.workSessionTimer?.countDown();
        this.$refs.shortTimer?.stopTime();
        this.$refs.longTimer?.stopTime();
      } else if (this.timerType === timerType.shortBreak && this.$store.getters.autoStartBreak) {
        this.$refs.shortTimer?.countDown();
        this.$refs.workSessionTimer?.stopTime();
        this.$refs.longTimer?.stopTime();
      } else if (this.timerType === timerType.longBreak && this.$store.getters.autoStartBreak) {
        this.$refs.longTimer?.countDown();
        this.$refs.workSessionTimer?.stopTime();
        this.$refs.shortTimer?.stopTime();
      }
      console.log("After tab change:", this.timerType);
    }

  },
  computed: {
    getWorkingSession() {
      if (this.$store.getters.timerState && this.$store.getters.loggedIn) {
        return this.$store.getters.timerState.secondsRemaining
      }
      return this.$store.getters.timerSettings.workSessionDuration;
    },
    getShortTime() {
      if (this.$store.getters.timerState && this.$store.getters.loggedIn) {
        return this.$store.getters.timerState.secondsRemaining
      }
      return this.$store.getters.timerSettings.shortBreakDuration;
    },
    getLongTime() {
      if (this.$store.getters.timerState && this.$store.getters.loggedIn) {
        return this.$store.getters.timerState.secondsRemaining
      }
      return this.$store.getters.timerSettings.longBreakDuration;
    },
    getCurrentTimer() {
      return this.$store.getters.currentTimer;
    },
    timerType: {
      get() {
        return this.$store.getters.currentTimer;
      },
      set(tab) {
        this.$store.dispatch("setTimerType", tab);
      },
    },
  },

});

</script>
<style scoped lang="scss">
@import "@/variables.scss";

.timer__wrapper {
  display: flex;
  flex-direction: column;
  box-shadow: none;
  background-color: rgb(255, 255, 255, 0.1);
}

::v-deep .v-slide-group__content {
  color: white;
  text-transform: none;
  font-size: 14px;
}

::v-deep .v-slide-group__content button {
  text-transform: none;
  font-weight: 300;
}

.v-tab--selected {
  background-color: rgb(0, 0, 0, 0.1);
  font-weight: bold !important;
}


.timer__tabs {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 5px;
  .v-tab{
    padding: 0px 12px;
  }
}

.v-card {
  width: 550px;
  height: 350px;
  max-width:100%;
  margin: 0 auto;
  margin-top: 20px;
}
</style>
