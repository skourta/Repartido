<template>
  <div id="app" class="bg-back-500">
    <header class="bg-back-300 border-b-2 border-white flex">
      <h1 class="m-auto text-center">
        TP SYSR: KOURTA-BENABED
      </h1>
    </header>
    <div class="insideGrid">
      <ProcessState
        v-for="process in processes"
        :key="process.id"
        :process="process"
      ></ProcessState>
    </div>
    <!-- <footer class=" bg-back-300"></footer> -->
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
import ProcessState from "./components/ProcessState";
import { PROCESS_NUMBER } from "./constants";
export default {
  name: "App",
  components: {
    ProcessState,
  },
  data() {
    return {
      processes: [],
    };
  },
  methods: {
    testIPC() {
      ipcRenderer.send("getInfo", "ping");
    },
  },
  mounted() {
    for (let index = 0; index < PROCESS_NUMBER; index++) {
      this.processes.push({
        id: index,
        clock: null,
        insideCritical: null,
        waiting: [],
        deferred: [],
      });
    }
    ipcRenderer.on("info", (event, data) => {
      console.log(data);
      this.processes.splice(data.id, 1, data);
    });

    ipcRenderer.on("down", (event, data) => {
      console.log(data);
      this.processes[data.id].state = false;
    });
  },
};
</script>

<style lang="scss">
#app {
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr 15fr;
}
.insideGrid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr 1fr;
  gap: 1vh;
  padding: 1vh;
}
</style>
