import Vue from 'vue'
import App from './App.vue'
import LineChartPlugin from './components/lineChart.js'

Vue.config.productionTip = false
Vue.use(LineChartPlugin)

/* eslint-disable no-new */
new Vue({
  render: h => h(App),
}).$mount('#app')
