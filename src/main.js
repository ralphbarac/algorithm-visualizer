import Vue from 'vue'
import App from './App.vue'
import Grid from './components/Grid.vue'
import Tutorial from './components/Tutorial.vue'

Vue.config.productionTip = false

Vue.component('grid', Grid)
Vue.component('tutorial', Tutorial)

export const eventBus = new Vue()

new Vue({
  render: h => h(App)
}).$mount('#app')
