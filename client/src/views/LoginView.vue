<template>
    <div class="wrapper">
      <div class="header">
        <div class="app__logo">
          <v-img src="@/assets/brandlogo-white.png" width="325px" eager> </v-img>
        </div>
      </div>
      <v-btn class="skip__button" flat @click="navToRegister">
        Skip to page <v-icon> mdi-arrow-right</v-icon>
      </v-btn>
      <div class="login-subtitle">Login</div>
      <div class="login_wrapper">
        <AppLogin class="center pa-5"> </AppLogin>
      </div>
      <div class="footer">
        <span class="need-an-account"> Do not have an account? </span> <br />
        <a class="font-weight-bold" href="/register">Create an account</a>
      </div>
    </div>
  </template>
  
  <script>
  import AppLogin from "@/components/AppLogin.vue";
  export default {
    name: "LoginView",
    components: {
      AppLogin,
    },
    methods: {
      navToRegister() {
        this.$router.push({ name: "home" });
      },
    },
  };
  </script>
  
  <style scoped lang="scss">
  @import "@/variables.scss";
  
  .skip__button {
    background-color: $app-background-color;
    color: white;
    opacity: 75%;
    position: absolute;
    top: 0%;
    right: 0%;
  }
  
  .app__logo {
    margin: auto;
  }
  
  ::v-deep .v-card {
    width: 375px;
    max-width:100%;
    height: 360px;
    border-radius: 10px;
  
    margin-left: auto;
    margin-right: auto;
  }
  
  .footer {
    text-align: center;
    align-self: center;
    flex-grow: 1;
    width: 100%;
    justify-self: center;
  }
  
  a {
    color: white;
  }
  
  .need-an-account {
    font-size: 18px;
    font-weight: 300;
    color: white;
  }
  
  .login_wrapper {
    position: relative;
    flex-grow: 1;
    align-content: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
  }
  
  .login-subtitle {
    text-align: center;
    font-size: 20px;
    color: white;
    opacity: 70%;
    font-weight: 500;
    padding: 10px 0px;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  </style>
  