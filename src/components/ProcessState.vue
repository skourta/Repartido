<template>
  <div
    class="w-full h-full container border-2 border-white rounded-md flex flex-col p-2"
  >
    <div class="grid2">
      <div class="item">
        ID
      </div>
      <div class="item justify-center">
        <div
          class=" h-6 w-6 rounded-full  border-white border-2 flex justify-center items-center"
        >
          {{ process.id }}
        </div>
      </div>
    </div>
    <div class="grid2">
      <div class="item">
        State
      </div>
      <div class="item justify-center">
        <div
          class=" h-5 w-5 rounded-full  border-white border-2"
          :class="{
            'bg-green-500': process.state,
            'bg-danger': !process.state
          }"
        ></div>
      </div>
    </div>

    <div class="grid2">
      <div class="item">
        Clock
      </div>
      <div class="item">
        <div
          class="h-6 w-full rounded-full  border-white border-2 flex justify-center items-center"
        >
          {{ process.clock }}
        </div>
      </div>
    </div>
    <div class="grid2">
      <div class="item text-sm">
        Inside Critical
      </div>
      <div class="item justify-center">
        <div
          class=" h-5 w-5 rounded-full  border-white border-2"
          :class="{
            'bg-green-500': process.insideCritical,
            'bg-danger': !process.insideCritical
          }"
        ></div>
      </div>
    </div>
    <div class=" col-span-2 row-span-2 rounded-lg   flex flex-col">
      <label class=" text-xs items-baseline"> Waiting for</label>
      <div class="grid10 w-full flex-grow">
        <div
          v-for="(p, index) in process.waiting"
          :key="index"
          class="text-xs flex flex-col justify-center items-center"
        >
          {{ index }}
          <div
            class=" h-4 w-4 rounded-full  border-white border-2"
            :class="{
              'bg-green-500': p,
              'bg-danger': !p
            }"
          ></div>
        </div>
      </div>
    </div>
    <div class=" col-span-2 row-span-2 rounded-lg   flex flex-col">
      <label class=" text-xs items-baseline"> Deferred</label>
      <div class="grid10 w-full flex-grow">
        <div
          v-for="(p, index) in process.deferred"
          :key="index"
          class="text-xs flex flex-col justify-center items-center"
        >
          {{ index }}
          <div
            class=" h-4 w-4 rounded-full  border-white border-2"
            :class="{
              'bg-green-500': p,
              'bg-danger': !p
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProcessState",
  props: {
    process: {
      type: Object,
      default: () => {
        return {
          id: 0,
          state: true,
          clock: 100,
          insideCritical: false,
          waiting: [
            false,
            false,
            false,
            true,
            false,
            false,
            false,
            false,
            false,
            false
          ],
          deferred: [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
          ]
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
}

.item {
  @apply flex items-center pl-2 flex-grow;
}

.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 1vh;
}
.grid10 {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr 1fr;
}
</style>
