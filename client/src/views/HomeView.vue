<template>
  <div :class="['wrapper pt-0', getWrapperClass]">
    <div :class="['app__toolbar', getWrapperClass]">
      <div>
        <v-img src="@/assets/brandlogo-white.png" width="100px"> </v-img>
      </div>
      <div class="app__toolbar__buttonPanel">
        <v-btn v-if="!$store.state.loggedIn" @click="routeToLogin"> <v-icon>mdi-account</v-icon> Login</v-btn>
        <v-btn v-if="$store.state.loggedIn" @click="logOut()"> <v-icon>mdi-account</v-icon> Logout</v-btn>
        <v-btn @click="openSettingsDialog"> <v-icon>mdi-cog-outline</v-icon>Settings</v-btn>
      </div>
    </div>
    <div class="middle__wrapper">
      <PomodoroTimer> </PomodoroTimer>
    </div>
    <div class="middle__wrapper">
      <TaskView ref="taskView"> </TaskView>
    </div>
    <SettingsComponent ref="settingsComponent" />
  </div>
</template>
  
<script>
import { defineComponent } from "vue";
import PomodoroTimer from "@/components/PomodoroTimer.vue";
import SettingsComponent from "@/components/SettingsComponent.vue";
import TaskView from "@/components/TaskView.vue";
import AuthorizationService from "@/services/AuthorizationService"
import SettingsService from "@/services/SettingsService";


export default defineComponent({
  name: "HomeView",
  components: {
    PomodoroTimer,
    SettingsComponent,
    TaskView
  },
  data: () => ({

  }),
  computed: {
    getWrapperClass() {
      switch (this.$store.getters.currentTimer) {
        case 0:
          return "timer__wrapper__pomo";
        case 1:
          return "timer__wrapper__shortBreak";
        default:
          return "timer__wrapper__longBreak";
      }
    }
  },
  methods: {
    routeToLogin() {
      this.$router.push({ name: "login" });
    },
    openSettingsDialog() {
      this.$refs.settingsComponent.openDialog();
    },
    logOut() {
      AuthorizationService.logout().then(response => {
        this.$store.dispatch("setToken", null);
        this.$store.dispatch("setUser", null);
        this.$store.dispatch("setLoggedIn", false);
        localStorage.removeItem("user");
        this.$router.push({ name: "login" })
      }).catch(err => console.log(err))
    },
    async fetchUserSettings() {
      try {
        const response = await SettingsService.getUserSettings();
        this.$store.commit("updateTimerSettings", response);
      } catch (error) {
        console.error("Error fetching user settings:", error);
      }
    },
  },
  mounted() {
    const user = localStorage.getItem('user');
    if (user) {
      this.$store.commit('setLoggedIn', true);
      this.$store.commit('setUser', user);
      this.$refs.taskView.handleUserSet(true);

      this.fetchUserSettings();
    }
  }
});
</script>
<style scoped lang="scss">
@import "@/variables.scss";

.timer__wrapper__pomo {
  background-color: $app-background-color;
}

.timer__wrapper__shortBreak {
  background-color: $app-shortBreak-color;
}

.timer__wrapper__longBreak {
  background-color: $app-longBreak-color;
}

.app__toolbar {
  left: 30%;
  width: 550px;
  max-width: 100%;
  border-bottom: 1px solid rgb(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 75px;
  margin: auto;
}
.app__toolbar__buttonPanel {
  display: flex;
  gap: 0px 10px;
  justify-self: end;
}

.app__toolbar__buttonPanel .v-btn {
  background-color: rgb(255, 255, 255, 0.1);
  color: white;
  font-size: 12px;
  font-weight: 300;
  text-transform: none;
  box-shadow: none;
}

.middle__wrapper {
  flex-grow: 1;
  justify-content: center;
}
</style>
  