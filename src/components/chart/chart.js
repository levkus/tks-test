import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

import Graph from './graph/graph'
import Tooltip from './tooltip/tooltip'
import Grid from './grid/grid'
import Triggers from './triggers/triggers'

export default class Chart extends Component {
  constructor (props) {
    super(props)

    this.state = {
      points: [],
      yMin: 0,
      yMax: 0,
      deltaX: 0,
      deltaY: 0,
      polylineCoordinates: '',
      dates: [],
      showTooltip: false,
      tooltip: { x: 0, y: 0, date: 0, value: 0, prevValue: 0, positive: true },
      point: { x: 0, y: 0 }
    }
  }

  componentWillMount () {
    const { data, width, height, padding } = this.props
    this.parseData(data, width, height, padding)
  }

  componentWillReceiveProps (nextProps) {
    const { data, width, height, padding } = nextProps
    if (nextProps !== this.props) {
      this.parseData(data, width, height, padding)
    }
  }

  parseData = (data, width, height, padding) => {
    const points = []
    const values = []
    const dates = []
    let prevValue = NaN
    _.map(data, item => {
      const point = {
        value: item.value,
        date: item.date,
        prevValue
      }
      dates.push(item.date)
      values.push(item.value)
      points.push(point)
      prevValue = item.value
    })

    // Находим минимальное и максимальное значение из массива 'values' и округляем
    let yMin = Math.min.apply(null, values)
    let yMax = Math.max.apply(null, values)
    const yPrecision = -1 * ((yMax - yMin).toFixed(0).length - 1)
    yMin = _.floor(yMin, yPrecision)
    yMax = _.ceil(yMax, yPrecision)

    // Считаем отступ слева для больших чисел
    const offsetX = -1 * (yPrecision - 1) * 8

    // Считаем расстояние между точками по горизонтали
    const deltaX = (width - padding * 2 - offsetX) / (data.length - 1)

    // Находим частное высоты графика и разницы максимального и минимального значений
    const deltaY = (height - padding * 2) / (yMax - yMin)

    // Добавляем объектам в массиве координаты, а так же записываем их в отдельную
    // строку для <polyline />
    let step = 0
    let polylineCoordinates = ''
    _.map(points, point => {
      point.y = _.round((padding + ((yMax - point.value) * deltaY)), 2)
      point.x = step * deltaX + padding + offsetX
      polylineCoordinates += `${point.x},${point.y} `
      step++
    })

    // Записываем собранные данные в state
    this.setState({ deltaX, deltaY, points, yMin, yMax, offsetX, polylineCoordinates, dates })
  }

  toggleTooltip = event => {
    switch (event.type) {
      case 'mouseenter':
        !this.state.showTooltip ? this.setState({ showTooltip: true }) : false
        break
      case 'mouseleave':
        this.state.showTooltip ? this.setState({ showTooltip: false }) : false
        break
    }
  }

  // Устанавливаем значения для вплывающей подсказки
  setTooltip = (x, y, date, value, prevValue) => event => {
    const tooltipX = x + 132 + this.state.offsetX < this.props.width ? x + 2 : x - 132 - this.state.offsetX
    const tooltipY = y - 58 >= 10 ? y - 58 : y + 8
    console.log(typeof y, typeof tooltipY)
    const positive = value >= prevValue

    this.setState({
      tooltip: { x: tooltipX, y: tooltipY, date, value, prevValue, positive },
      point: { x, y }
    })
  }

  render () {
    const { width, height, background, padding } = this.props
    const { tooltip, point, offsetX, polylineCoordinates, yMin, yMax, dates, deltaX } = this.state
    return (
      <svg
        width={width}
        height={height + padding + 10}
        onMouseEnter={this.toggleTooltip}
        onMouseLeave={this.toggleTooltip}
      >
        <rect width={width} height={height + padding + 10} fill={background} />
        <Grid
          width={width}
          height={height}
          padding={padding}
          yMin={yMin}
          yMax={yMax}
          offsetX={offsetX}
          dates={dates}
          deltaX={deltaX}
        />
        <Graph points={polylineCoordinates} />
        <Tooltip
          tooltip={tooltip}
          point={point}
          showTooltip={this.state.showTooltip}
          offsetX={offsetX}
          bottom={height - padding}
        />
        <Triggers
          points={this.state.points}
          deltaX={deltaX}
          height={height + padding + 10}
          setTooltip={this.setTooltip}
        />
      </svg>
    )
  }
}

Chart.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  background: PropTypes.string,
  data: PropTypes.array
}
