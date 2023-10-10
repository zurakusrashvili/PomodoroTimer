<template>
    <div class="wrapper">
      <div class="d-flex justify-space-between">
        <div class="app__logo">
          <v-img src="@/assets/brandlogo-white.png" width="300px" eager> </v-img>
        </div>
      </div>
      <div class="login-subtitle">Register</div>
  
      <div class="login_wrapper">
        <AppRegister class="center"> </AppRegister>
        <div class="text-center">
          <span class="need-an-account"> Need an account? </span> <br />
          <a class="font-weight-bold" href="/register">Create an account</a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import AppRegister from "@/components/AppRegister.vue";
  export default {
    name: "RegisterView",
    components: {
      AppRegister,
    },
  };
  </script>
  
  <style scoped>
  .center {
    margin: auto;
    width: 50%;
  }
  
  .app__logo {
    margin: auto;
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
    font-size: 30px;
    color: white;
    opacity: 50%;
  }
  
  ::v-deep .v-card {
    width: 475px;
    max-width: 100%;
  
    border-radius: 10px;
  
    margin-left: auto;
    margin-right: auto;
  }
  </style>
  