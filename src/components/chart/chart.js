import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

import Tooltip from './tooltip.js'

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

    this.setTooltip = this.setTooltip.bind(this)
    this.toggleTooltip = this.toggleTooltip.bind(this)
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

  parseData (data, width, height, padding) {
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
    const offsetX = -1 * yPrecision * 8

    // Считаем расстояние между точками по горизонтали
    const deltaX = (width - padding * 2 - offsetX) / (data.length - 1)

    // Находим частное высоты графика и разницы максимального и минимального значений
    const deltaY = (height - padding * 2) / (yMax - yMin)

    // Добавляем объектам в массиве координаты, а так же записываем их в отдельную
    // строку для <polyline />
    let step = 0
    let polylineCoordinates = ''
    _.map(points, point => {
      point.y = padding + ((yMax - point.value) * deltaY)
      point.x = parseInt(step * deltaX) + padding + offsetX
      polylineCoordinates += `${point.x},${point.y} `
      step++
    })

    // Записываем собранные данные в state
    this.setState({ deltaX, deltaY, points, yMin, yMax, offsetX, polylineCoordinates, dates })
  }

  // Создаем невидимые области для обработки событий мыши
  renderTriggers () {
    const triggers = _.map(this.state.points, point => (
      <rect x={point.x - (this.state.deltaX / 2)} y='0'
        key={_.uniqueId('trigger_')}
        width={this.state.deltaX}
        height={this.props.height}
        style={{ 'cursor': 'pointer' }}
        fill='transparent'
        onMouseEnter={this.setTooltip(point.x, point.y, point.date, point.value, point.prevValue)}
      />
    ))
    return <g>{triggers}</g>
  }

  toggleTooltip (e) {
    switch (e.type) {
      case 'mouseenter':
        !this.state.showTooltip ? this.setState({ showTooltip: true }) : false
        break
      case 'mouseleave':
        this.state.showTooltip ? this.setState({ showTooltip: false }) : false
        break
    }
  }

  // Устанавливаем значения для вплывающей подсказки
  setTooltip (x, y, date, value, prevValue) {
    return event => {
      const tooltipX = x + 132 + this.state.offsetX < this.props.width ? x + 2 : x - 132 - this.state.offsetX
      const tooltipY = y - 58 > 10 ? y - 58 : y + 8
      const positive = parseFloat(value) >= parseFloat(prevValue)

      this.setState({
        tooltip: { x: tooltipX, y: tooltipY, date, value, prevValue, positive },
        point: { x, y }
      })
    }
  }

  renderY () {
    const { width, height, padding, axisTextClass } = this.props
    const { yMin, yMax, offsetX } = this.state
    const gridY = (height - padding * 2) / 4
    const deltaVal = yMax - yMin
    let pos = padding
    let val = this.state.yMax
    return _.times(5, item => {
      const line = <g key={_.uniqueId('gridY_')}>
        <line
          stroke='#E5E7E9'
          x1={padding + offsetX}
          x2={width - padding}
          y1={pos}
          y2={pos}
          strokeWidth='0.8'
        />
        <text className={axisTextClass} x={padding + offsetX - 8} y={pos} textAnchor='end'>{val}</text>
      </g>
      pos += gridY
      val = val - deltaVal / 4
      return line
    })
  }

  renderX () {
    const { padding, height, axisTextClass } = this.props

    let countedMonths = []
    let prevMonth = ''
    let countedYears = []
    let prevYear = ''
    _.map(this.state.dates, date => {
      const newMonth = date.toLocaleString('ru', { month: 'long' })
      if (newMonth !== prevMonth) {
        countedMonths = _.concat(countedMonths, { month: newMonth, count: 1 })
      } else {
        _.last(countedMonths).count++
      }

      const newYear = date.toLocaleString('ru', { year: 'numeric' })
      if (newYear !== prevYear) {
        countedYears = _.concat(countedYears, { year: newYear, count: 1 })
      } else {
        _.last(countedYears).count++
      }

      prevMonth = newMonth
      prevYear = newYear
    })

    let monthX = padding + this.state.offsetX
    const months = _.map(countedMonths, month => {
      const monthText =
        <text key={_.uniqueId('month_')} className={axisTextClass} x={monthX} y={height}>{month.month}</text>
      monthX += month.count * this.state.deltaX
      return monthText
    })

    let yearX = padding + this.state.offsetX
    const years = _.map(countedYears, year => {
      const yearText =
        <text key={_.uniqueId('year_')} className={axisTextClass} x={yearX} y={height + 20}>{year.year}</text>
      yearX += year.count * this.state.deltaX
      return yearText
    })

    return <g>
      {months}
      {years}
    </g>
  }

  render () {
    const { width, height, background, padding, lineClass, tooltipClass, projectionClass,
    pointClass, tooltipDateClass, tooltipTextClass, tooltipIncreaseClass, tooltipDecreaseClass } = this.props
    const { tooltip, point, offsetX, polylineCoordinates } = this.state
    return (
      <div onMouseEnter={this.toggleTooltip} onMouseLeave={this.toggleTooltip}>
        <svg width={width} height={height + padding + 10}>
          <rect width={width} height={height + padding + 10} fill={background} />
          {this.renderY()}
          {this.renderX()}
          <polyline fill='none' points={polylineCoordinates} className={lineClass} pointerEvents='none' />
          <Tooltip
            bottom={height - padding}
            showTooltip={this.state.showTooltip}
            tooltip={tooltip}
            offsetX={offsetX}
            point={point}
            tooltipClass={tooltipClass}
            tooltipDateClass={tooltipDateClass}
            tooltipTextClass={tooltipTextClass}
            tooltipIncreaseClass={tooltipIncreaseClass}
            tooltipDecreaseClass={tooltipDecreaseClass}
            projectionClass={projectionClass}
            pointClass={pointClass}
          />
          {this.renderTriggers()}
        </svg>
      </div>
    )
  }
}

Chart.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  lineClass: PropTypes.string,
  axisTextClass: PropTypes.string,
  pointClass: PropTypes.string,
  tooltipClass: PropTypes.string,
  projectionClass: PropTypes.string,
  tooltipDateClass: PropTypes.string,
  tooltipTextClass: PropTypes.string,
  tooltipIncreaseClass: PropTypes.string,
  tooltipDecreaseClass: PropTypes.string,
  background: PropTypes.string,
  data: PropTypes.array
}
