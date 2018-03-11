import Vue from 'vue'
import App from './App'
import LineChartPlugin from './components/lineChart.js'

Vue.config.productionTip = false
Vue.use(LineChartPlugin)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
