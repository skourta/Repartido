<template>
  <div id="app">
    <ProcessState></ProcessState>
  </div>
</template>

<script>
import ProcessState from "./components/ProcessState";
export default {
  name: "App",
  components: {
    ProcessState
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
