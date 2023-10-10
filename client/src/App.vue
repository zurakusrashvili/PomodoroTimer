<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "App",

  data() {
    return {
      //
    };
  },
});
</script>
<style scoped lang="scss">
@import "variables.scss";
.v-application {
  background-color: $app-background-color;
  font-family: "ArialRounded", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
}

.wrapper {
  min-height: 100vh;
  padding: 14px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-content: center;
}
</style>