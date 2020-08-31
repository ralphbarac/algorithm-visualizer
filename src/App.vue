<template>
  <div class="page-container">
    <grid></grid>
  </div>
</template>

<script>
import Grid from './components/Grid.vue'
export default {
  components: {
    Grid
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

</style>
