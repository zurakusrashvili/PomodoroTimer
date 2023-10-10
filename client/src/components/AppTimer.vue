<template>
  <div>
    <div :class="{ timer__display: true }" @input="stringToSeconds">
      {{ formatTime }}
    </div>
    <v-card-actions>
      <v-btn :class="{ app__timer__startButton: true, clicked: !isRunning }"
        @click="isRunning ? countDown() : stopTime()">
        {{ isRunning ? "Start" : "Stop" }}</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";
import ticking_slow from "../assets/audio/ticking-slow.mp3";
import alarm_wood from "../assets/audio/alarm-wood.mp3";
import TimerStateService from "@/services/TimerStateService";

export default defineComponent({
  name: "AppTimer",
  data: () => ({
    timeInSeconds: 5,
    interval: null,
    canEditTime: false,
    currentAudio: new Audio(),
    timerStarted: false,
  }),
  props: {
    initialTimeInSeconds: { type: Number, required: true },
  },
  mounted() {

  },
  methods: {
    async countDown() {
      this.tickingSoundPlay();
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;

        if (this.timerStarted) {
          await this.saveTimerState();
        }
      } else {
        this.interval = setInterval(async () => {
          if (this.timeInSeconds >= 1) {
            this.timeInSeconds -= 1;
            if (!this.timerStarted) {
              await this.autoSaveTimerState();
              await this.saveTimerState();
              this.timerStarted = true;
            }
          } else {
            clearInterval(this.interval);
            this.interval = null;
            this.timeInSeconds = this.initialTimeInSeconds;
            this.alarmPlay();
            this.$emit("timeFinished");
            this.timerStarted = false;

            window.removeEventListener('beforeunload', () => {
              console.log("removed listener")
            });

            await this.saveTimerState();
          }
        }, 1000);
      }
    },
    async autoSaveTimerState() {
      window.addEventListener("beforeunload", (e) => {
        if (this.interval) {
          try {
            this.saveTimerState();
            console.log("Timer state saved successfully");
          } catch (error) {
            console.error("Error saving timer state:", error);
          }
        }
      });
    },
    async saveTimerState() {
      const timerData = {
        timerType: this.$store.getters.currentTimer,
        taskId: this.$store.getters.currentTask?.id,
        secondsRemaining: this.timeInSeconds,
      };
      if (this.$store.getters.loggedIn) {
        await TimerStateService.saveOrUpdateTimerState(timerData);
      } else {
        localStorage.setItem("timerState", timerData)
      }
    },
    tickingSoundPlay() {
      if (this.$store.getters.timerSettings.tickingSoundOn) {
        this.currentAudio.src = ticking_slow;
        this.currentAudio.load();
        this.currentAudio.loop = true;
        this.currentAudio.play();
      }
    },
    async alarmPlay() {
      if (this.$store.getters.timerSettings.alarmSoundOn) {
        this.currentAudio.src = alarm_wood;
        this.currentAudio.load();
        this.currentAudio.loop = false;

        setTimeout(() => {
          this.currentAudio.play();
        }, 500);
      }
    },
    stopTime() {
      clearInterval(this.interval);
      this.currentAudio.pause();
      this.interval = null;

      if (this.timerStarted) {
        this.saveTimerState();
      }
    },
    restartInitialTime() {
      this.timeInSeconds = this.initialTimeInSeconds;
    },
  },
  created() {
    this.timeInSeconds = this.initialTimeInSeconds;
  },
  computed: {
    formatTime() {
      let hours = Math.floor(this.timeInSeconds / 3600);
      let minutes = Math.floor((this.timeInSeconds - 3600 * hours) / 60);
      let seconds = Math.floor(
        this.timeInSeconds - 3600 * hours - 60 * minutes
      );
      let hoursStr = hours < 10 ? "0" + hours : hours;
      let minutesStr = minutes < 10 ? "0" + minutes : minutes;
      let secondsStr = seconds < 10 ? "0" + seconds : seconds;
      return `${minutesStr}:${secondsStr}`;
    },
    isRunning() {
      return this.interval === null;
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
  watch: {
    initialTimeInSeconds(newVal) {
      console.log("Initial time updated in AppTimer:", newVal);
      this.timeInSeconds = newVal;
    },
  },
});
</script>

<style scoped lang="scss">
@import "@/variables.scss";

.timer__display {
  font-size: 120px;
  text-align: center;
  color: white;
  font-weight: bold;
  justify-self: start;
}
@media only screen and (max-width: 340px){
  .timer__display{
    font-size: 100px;
  }
}

.app__timer__startButton {
  color: $app-background-color;
  background-color: white;
  box-shadow: rgb(235 235 235) 0px 6px 0px;
  width: 220px;
  height: 55px;
  font-size: 24px;
  margin: auto;
  justify-self: center;
  font-weight: bold;
}

.clicked {
  box-shadow: none;
  transform: translateY(6px);
}
</style>
