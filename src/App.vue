<template>
  <div class="page-container">
    <tutorial class="modal-mask" v-if='showTutorial'></tutorial>
    <grid></grid>
  </div>
</template>

<script>
import Grid from './components/Grid.vue'
import Tutorial from './components/Tutorial.vue'

import { eventBus } from './main'

export default {
  created () {
    eventBus.$on('showTutorial', bool => {
      this.showTutorial = bool
    })
  },
  data: function () {
    return {
      showTutorial: true
    }
  },
  components: {
    Grid,
    Tutorial
  }
}
</script>

<style>
:root {
  --colour-primary: #EB2F46;
  --colour-primary-light: #FF3366;
  --colour-primary-dark: #BA265D;

  --colour-gray-light-1: #FAF9F9;
  --colour-gray-light-2: #F4F2F2;
  --colour-gray-light-3: #F0EEEE;
  --colour-gray-light-4: #CCC;

  --colour-gray-dark-1: #333;
  --colour-gray-dark-2: #777;
  --colour-gray-dark-3: #999;
}

*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
  font-family: 'Space Mono', sans-serif;
}

html {
  font-size: 62.5%;
  height: 100%;
}

.page-container {
  display: flex;
  flex-direction: column;
  background-color: var(--colour-gray-light-1);
  min-height: 100vh;
}

.modal-mask {
  position: fixed;
  z-index: 200;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3 ease;
}

</style>
