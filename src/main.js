import Vue from 'vue'
import App from './App.vue'
import Grid from './components/Grid.vue'
import Node from './components/Node.vue'

Vue.config.productionTip = false

Vue.component('grid', Grid)
Vue.component('node', Node)

export const eventBus = new Vue()

new Vue({
  render: h => h(App)
}).$mount('#app')
