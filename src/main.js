import Vue from 'vue'
import App from './App.vue'
import Grid from './components/Grid.vue'

Vue.config.productionTip = false

Vue.component('grid', Grid)

new Vue({
  render: h => h(App)
}).$mount('#app')
