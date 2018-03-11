<template>
  <div id="app">
    <chart-component/>
  </div>
</template>

<script>

import ChartComponent from './components/ChartComponent'

export default {
  name: 'App',
  components: {
    ChartComponent
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #35495e;
  margin-top: 60px;
}
</style>
