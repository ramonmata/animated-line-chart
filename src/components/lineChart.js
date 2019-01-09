/*
    Ramon Mata - 2018
    Website: ramon.mata.com.mx
    GitHub: github.com/ramonmata
    Line Chart with Canvas
    Written entirely with JS without depdencies, making use of Canvas API

    Contains some hardcoded values for demo
*/

var LineChart = (function () {
  let config = {
    containerElement: null,
    chartWidth: 200,
    chartHeight: 100,
    chartPadding: 20,
    animationStopped: false,
    animationFrameId: null,
    animationFrames: 20,
    dataPoints: null,
    _dataPoints: null,
    exampleDataPoints: 20,
    pointSpacing: null,
    pointSpacingHalf: null,
    pointSize: 2,
    mousePointer: {x: 0, y: 0}
  }

  let ctxTop = null
  let ctxChart = null
  let topCanvas = null
  let chartCanvas = null
  let callBack = null

  let init = function (container, width, height, dataPoints, cb) {
    config.containerElement = document.getElementById(container)
    config.chartWidth = width
    config.chartHeight = height
    callBack = cb
    setupTopCanvas()
    setupChartCanvas()
    setupListeners()
    setupDataPoints(dataPoints)
    draw()
  }

  function setupTopCanvas () {
    topCanvas = document.createElement('canvas')
    topCanvas.setAttribute('width', config.chartWidth)
    topCanvas.setAttribute('height', config.chartHeight)
    topCanvas.setAttribute('style', 'position: absolute;')
    ctxTop = topCanvas.getContext('2d')
    config.containerElement.appendChild(topCanvas)
  }

  function setupChartCanvas () {
    chartCanvas = document.createElement('canvas')
    chartCanvas.setAttribute('width', config.chartWidth)
    chartCanvas.setAttribute('height', config.chartHeight)
    ctxChart = chartCanvas.getContext('2d')
    config.containerElement.appendChild(chartCanvas)
  }

  function setupListeners () {
    topCanvas.addEventListener('mousemove', function (event) {
      let offsetLeft = event.target.offsetLeft
      let offsetTop = event.target.offsetTop
      config.mousePointer = {x: event.x - offsetLeft, y: event.y - offsetTop}
      requestAnimationFrame(drawPointerLocation)
    })
    topCanvas.addEventListener('mouseout', function () {
      config.mousePointer = null
      requestAnimationFrame(drawPointerLocation)
    })
    topCanvas.addEventListener('click', function () {
      validateMouseClick()
    })
  }

  function setupDataPoints (dataPoints) {
    if (!dataPoints) {
      makeExampleDataPoints()
    } else {
      config.dataPoints = dataPoints
    }
    config.pointSpacing = (config.chartWidth / config.dataPoints.length)
    config.pointSpacingHalf = (config.pointSpacing / 2) - (config.pointSize / 2)
    translateDataPointsToChart()
  }

  function makeExampleDataPoints () {
    let dataPoints = []
    for (var i = 0; i < config.exampleDataPoints; i++) {
      dataPoints.push(Math.random() * 100)
    }
    config.dataPoints = dataPoints
  }

  function translateDataPointsToChart () {
    let min, max
    config._dataPoints = []

    // Find min/max
    config.dataPoints.forEach((element, index) => {
      if (index === 0) {
        min = max = element
      } else {
        if (element < min) {
          min = element
        }
        if (element > max) {
          max = element
        }
      }
    })

    config.dataPoints.forEach(element => {
      config._dataPoints.push(map(element, min, max, config.chartPadding, config.chartHeight - config.chartPadding))
    })
  }

  // Math magic functions
  function norm (value, min, max) {
    return (value - min) / (max - min)
  }

  function lerp (norm, min, max) {
    return (max - min) * norm + min
  }

  function map (value, srcMin, srcMax, dstMin, dstMax) {
    return lerp(norm(value, srcMin, srcMax), dstMin, dstMax)
  }
  // Math magic functions

  function drawPointerLocation () {
    ctxTop.clearRect(0, 0, config.chartWidth, config.chartHeight)

    if (!config.mousePointer) {
      return
    }

    ctxTop.strokeStyle = '#42b98390'
    ctxTop.lineWidth = 1
    ctxTop.setLineDash([1, 3])

    // Vertical line
    ctxTop.beginPath()
    ctxTop.moveTo(config.mousePointer.x, 0)
    ctxTop.lineTo(config.mousePointer.x, config.chartHeight)
    ctxTop.stroke()

    // Horizontal Line
    ctxTop.beginPath()
    ctxTop.moveTo(0, config.mousePointer.y)
    ctxTop.lineTo(config.chartWidth, config.mousePointer.y)
    ctxTop.stroke()

    // XY Position relative to canvas
    ctxTop.font = '0.7em Avenir'
    ctxTop.fillStyle = '#000099'
    ctxTop.fillText('X: ' + config.mousePointer.x + ', Y: ' + config.mousePointer.y, 0, 10)

    // DataPoint Value
    config._dataPoints.forEach((element, index) => {
      let elementAreaStart = (index * config.pointSpacing)
      let elementAreaEnd = ((index + 1) * config.pointSpacing)
      if (config.mousePointer.x > elementAreaStart && config.mousePointer.x < elementAreaEnd) {
        ctxTop.font = '0.8em Avenir'
        ctxTop.fillStyle = '#248f24'
        let displayValue = config.dataPoints[index].toFixed(2)
        let textWidth = ctxTop.measureText(displayValue).width
        let textHalfWidth = textWidth / 2
        ctxTop.fillText(displayValue, config.mousePointer.x - textHalfWidth, config.chartHeight - element - 5)
      }
    })
  }

  function draw () {
    ctxChart.clearRect(0, 0, config.chartWidth, config.chartHeight)

    ctxChart.strokeStyle = '#000099'
    ctxChart.beginPath()
    config._dataPoints.forEach((element, index) => {
      let value = element / config.animationFrames
      if (index === 0) {
        ctxChart.moveTo((index * config.pointSpacing) + config.pointSpacingHalf, config.chartHeight - value)
      } else {
        ctxChart.lineTo((index * config.pointSpacing) + config.pointSpacingHalf, config.chartHeight - value)
      }
    })
    ctxChart.stroke()

    ctxChart.fillStyle = '#000066'
    config._dataPoints.forEach((element, index) => {
      let value = element / config.animationFrames
      ctxChart.beginPath()
      ctxChart.arc(
        (index * config.pointSpacing) + config.pointSpacingHalf, config.chartHeight - value, config.pointSize, 0, 2 * Math.PI
      )
      ctxChart.fill()
    })

    config.animationFrames--

    if (config.animationFrames < 1) {
      stopAnimation()
    } else {
      if (!config.animationStopped) {
        config.animationFrameId = requestAnimationFrame(draw)
      }
    }
  }

  function validateMouseClick () {
    // Check if click is around a data point, if so return it
    config._dataPoints.forEach((element, index) => {
      let elementAreaStart = (index * config.pointSpacing)
      let elementAreaEnd = ((index + 1) * config.pointSpacing)
      if (config.mousePointer.x > elementAreaStart && config.mousePointer.x < elementAreaEnd) {
        callBack({index: index, value: config.dataPoints[index]})
      }
    })
  }

  function startAnimation () {
    if (!config.animationFrameId) {
      config.animationFrames = 30
      config.animationStopped = false
      config.animationFrameId = requestAnimationFrame(draw)
    }
  }

  function stopAnimation () {
    cancelAnimationFrame(config.animationFrameId)
    config.animationStopped = true
    config.animationFrameId = null
  }

  function generateData () {
    setupDataPoints()
    startAnimation()
  }

  return { init: init, start: startAnimation, generateData: generateData }
})()

export default {
  install: function (Vue) {
    Object.defineProperty(Vue.prototype, '$lineChart', { value: LineChart })
  }
}
