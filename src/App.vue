<template>
  <div>
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
  --primary-colour: #D1E8E2;
  --primary-dark-accent: #116466;
  --primary-light-accent: #D9B08C;
  --secondary-light-accent: #FFCB9A;
  --text-colour: #2C3531;
}

body {
  background-color: var(--primary-colour);
}

</style>
