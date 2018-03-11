<template>
  <div class="component">
    <h1>{{name}}</h1>
    <div id="lineChartArea" v-bind:style="stageObject"></div>
    <div class="chartControls">
      <button id="Start" @click="startAnimation">Repeat Animation</button>
      <button id="GenData" @click="generateData">New Random Data</button>
    </div>
    <p v-if="dataPoint">Selected data point <strong>#{{dataPoint.index + 1}}</strong> with value of <strong>{{dataPoint.value.toFixed(2)}}</strong></p>
  </div>
</template>

<script>
export default {
  name: 'ChartComponent',
  data () {
    return {
      name: 'Line Chart',
      width: 600,
      height: 120,
      dataPoint: null
    }
  },
  computed: {
    stageObject: function () {
      return { height: this.$data.height + 'px' }
    }
  },
  mounted: function () {
    this.$lineChart.init('lineChartArea', this.$data.width, this.$data.height, null, this.chartClick)
  },
  methods: {
    startAnimation: function () {
      this.$lineChart.start()
    },
    generateData: function () {
      this.$data.dataPoint = null
      this.$lineChart.generateData()
    },
    chartClick: function (data) {
      this.$data.dataPoint = data
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: bold;
}
a {
  color: #42b983;
}
</style>
