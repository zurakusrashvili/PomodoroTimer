<template>
  <v-card dark class="pa-3 loginCard">
    <div class="app_divider"></div>
    <v-card-title class="pl-0">Sign-In</v-card-title>

    <div class="loginCard__mainPanel">
      <div>
        <span class="loginCard__label">Email</span>
        <v-text-field density="default" v-model="email" label="Login" :error-messages="emailValidationErrors">
        </v-text-field>
        <span class="loginCard__label">Password</span>
        <v-text-field density="default" outlined v-model="password" label="Password" :error-messages="passwordValidationErrors" type="password">
        </v-text-field>
      </div>
      <v-alert color="error" density="default" variant="text" class="pa-0 text-center" v-model="loginError">
        {{ loginErrorMessage }}
      </v-alert>
      <div class="mainbuttonPanel">
        <v-btn flat :rounded="1" @click="loginWithEmail" class="mt-1 mainbuttonPanel__login-button" size="large">
          Login
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import AuthorizationService from "../services/AuthorizationService";
import SettingsService from "@/services/SettingsService";
import taskService from "@/services/TasksService";

enum loginStates {
  Login = 0,
  Register,
  PasswordChange,
}

export default defineComponent({
  name: "AppLogin",
  data() {
    return {
      loginMode: loginStates.Login,
      email: "",
      password: "",
      user: "",
      isInvalidEmail: false,
      isEmptyEmail: false,
      loginError: false,
      loginErrorMessage: "",
      emailValidationErrors: [],
      passwordValidationErrors: [],
    };
  },
  computed: {
    loggedIn(): string {
      return `${this.user} has logged in`;
    },

    isEmptyCredentials(): boolean {
      return !(this.email && this.password);
    },
  },
  methods: {
    async onUserLogin() {
      let localTasks = JSON.parse(localStorage.getItem('localTasks') || '[]');
      localStorage.clear()
      if (localTasks.length > 0) {
        localTasks.forEach(async task => {
          await taskService.addTask(task);
        });
        localStorage.removeItem('localTasks');
      }
    },

    async login() {
      try {
        const response = await AuthorizationService.login({
          email: this.email,
          password: this.password,
        });

        this.$store.dispatch("setToken", response.token);
        this.$store.dispatch("setUser", response.user);
        
        await this.onUserLogin();

        localStorage.setItem("user", JSON.stringify(response.user));

        await this.fetchUserSettings();

        this.$router.push({ name: "home" });
        this.user = response.user.email;
      } catch (error) {
        switch (error.response.status) {
          case 500:
            this.setLoginAlert("Something went wrong", true);
            break;
          default:
            console.log(error.response);
            this.setLoginAlert(error.response.data.message, true);
            break;
        }
      }
    },

    navToRegister(): void {
      this.$router.push({ name: "register" });
    },

    loginWithEmail(): void {
      this.isInvalidEmail = !this.email.match(
        // eslint-disable-next-line
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

      if (!this.isInvalidEmail && !this.isEmptyCredentials) {
        this.login();
        this.isEmptyEmail = false;
      } else {
        this.isEmptyEmail = true;
      }
    },

    setLoginAlert(mssg: string, show: boolean): void {
      this.loginErrorMessage = mssg;
      this.loginError = show;
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
});
</script>

<style scoped lang="scss">
.mainbuttonPanel {
  display: flex;
  flex-direction: column;
  gap: 10px 0px;
}

.mainbuttonPanel__login-button {
  background-color: rgb(15, 14, 14) !important;
  opacity: 75%;
  color: white;
}

.v-btn {
  text-transform: none;
  font-weight: 450;
}

.loginCard__loginGoogleButton {
  width: 100%;
  font-weight: 550;
  color: grey;
  font-size: 15px;
}

.loginCard {
  padding: 12px;
  position: relative;
}

.loginCard__divider {
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  margin: 18px 0px;
  color: grey;
}

.loginCard__mainPanel {
  position: absolute;
  left: 5%;
  width: 90%;
}

.loginCard__label {
  padding: 8px 4px 4px 0px;
  font-weight: 550;
  font-size: 13px;
  text-transform: uppercase;
  font-family: "ArialRounded", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";

  color: rgb(196, 196, 196);
}
</style>
