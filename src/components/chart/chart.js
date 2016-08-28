import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

class Chart extends Component {
  constructor (props) {
    super(props)

    this.state = {
      points: [],
      yMin: NaN,
      yMax: NaN,
      deltaX: NaN,
      deltaY: NaN,
      polylineCoordinates: '',
      showPopup: false,
      popup: { x: 0, y: 0, value: 0, prevValue: 0 },
      projection: { x: 0, y: 0 },
      circle: { x: 0, y: 0 }
    }

    this.setPopup = this.setPopup.bind(this)
    this.showPopup = this.showPopup.bind(this)
    this.hidePopup = this.hidePopup.bind(this)
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
    // Считаем расстояние между точками по горизонтали
    const deltaX = (width - padding * 2 - 15) / (data.length - 1)

    // Заполняем массив 'points' объектами с горизонтальными координатами точек и их значениями
    // Заодно записываем все значения в отдельный массив 'values'
    const points = []
    const values = []
    let count = 0
    let prevValue = 0
    _.map(data, item => {
      const point = {
        x: parseInt(count * deltaX) + padding + 15,
        value: item.value,
        prevValue
      }
      values.push(item.value)
      points.push(point)
      prevValue = item.value
      count++
    })

    // Находим минимальное и максимальное значение из массива 'values' и округляем до 10
    const yMin = Math.floor(Math.min.apply(null, values) / 10) * 10
    const yMax = Math.ceil(Math.max.apply(null, values) / 10) * 10

    // Находим частное высоты графика и разницы максимального и минимального значений
    const deltaY = (height - padding * 2) / (yMax - yMin)

    // Добавляем объектам в массиве вертикальные координаты
    _.map(points, point => {
      point.y = padding + ((yMax - point.value) * deltaY)
    })

    // Собираем координаты точек в одну строку
    let polylineCoordinates = ''
    _.map(points, point => {
      polylineCoordinates += `${point.x},${point.y} `
    })

    // Записываем собранные данные в state
    this.setState({ deltaX, deltaY, points, yMin, yMax, polylineCoordinates })
  }

  // Создаем невидимые области для обработки событий мыши
  renderTriggers () {
    const triggers = _.map(this.state.points, point => (
      <rect x={point.x - (this.state.deltaX / 2)} y='0'
        key={_.uniqueId('toggle_')}
        width={this.state.deltaX}
        height={this.props.height}
        style={{ 'cursor': 'pointer' }}
        fill='transparent'
        onMouseEnter={this.setPopup(point.x, point.y, point.value, point.prevValue)}
      />
    ))
    return <g>{triggers}</g>
  }

  showPopup () {
    !this.state.showPopup ? this.setState({ showPopup: true }) : false
  }

  hidePopup () {
    this.state.showPopup ? this.setState({ showPopup: false }) : false
  }

  setPopup (x, y, value, prevValue) {
    return event => {
      const popupX = x + 122 < this.props.width ? x + 2 : x - 122
      const popupY = y - 58 > 10 ? y - 58 : y + 8
      this.setState({
        popup: { x: popupX, y: popupY, fill: '#fff', value, prevValue },
        projection: { x, y, stroke: '#D5D8D9' },
        circle: { x, y, fill: '#74A3C7', stroke: '#F6F7F8' }
      })
    }
  }

  renderGrid () {
    const { width, height, padding, axisTextClass } = this.props
    const gridY = (height - padding * 2) / 4
    const deltaVal = this.state.yMax - this.state.yMin
    let pos = padding
    let val = this.state.yMax
    return _.times(5, item => {
      const line = <g key={_.uniqueId('gridY_')}>
        <line
          stroke='#E5E7E9'
          x1={padding + 15}
          x2={width - padding}
          y1={pos}
          y2={pos}
          strokeWidth='0.8'
        />
        <text className={axisTextClass} x={padding + 5} y={pos} textAnchor='end'>{val}</text>
      </g>
      pos += gridY
      val = val - deltaVal / 4
      return line
    })
  }

  render () {
    const { width, height, background, padding, lineClass, popupClass, projectionClass,
    pointClass, popupTextClass, popupIncreaseClass, popupDecreaseClass } = this.props
    const { popup, projection, circle, polylineCoordinates } = this.state
    return (
      <div onMouseEnter={this.showPopup} onMouseLeave={this.hidePopup}>
        <svg width={width} height={height} ref='chart'>

          <filter id='shadow' height='130%'>
            <feGaussianBlur in='SourceAlpha' stdDeviation='1' /> // stdDeviation is how much to blur
            <feOffset dx='0' dy='1.5' result='offsetblur' /> // how much to offset
            <feComponentTransfer>
              <feFuncA type='linear' slope='0.15' />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode /> // this contains the offset blurred image
              <feMergeNode in='SourceGraphic' /> // this contains the element that the filter is applied to
            </feMerge>
          </filter>

          <rect width={width} height={height} fill={background} />

          {this.renderGrid()}

          <polyline fill='none' points={polylineCoordinates} className={lineClass} pointerEvents='none' />

          <g style={{ opacity: this.state.showPopup ? '1' : '0', transition: 'opacity .5s' }}>
            <g transform={`translate(${popup.x},${popup.y})`}>
              <rect width={120} height={50}
                className={popupClass}
                x={0} y={0}
                filter='url(#shadow)'
              />
              <text className={popupTextClass} x={10} y={26}>
                {popup.value.toString().replace('.', ',')}
              </text>
              <text
                className={popup.value - popup.prevValue > 0 ? popupIncreaseClass : popupDecreaseClass}
                x={60}
                y={26}>
                {popup.prevValue.toString().replace('.', ',')}
              </text>
            </g>
            <line x1={projection.x} x2={projection.x}
              y1={height - padding}
              y2={projection.y}
              className={projectionClass}
            />
            <circle cx={circle.x} cy={circle.y} className={pointClass} />
          </g>

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
  popupClass: PropTypes.string,
  projectionClass: PropTypes.string,
  popupTextClass: PropTypes.string,
  popupIncreaseClass: PropTypes.string,
  popupDecreaseClass: PropTypes.string,
  background: PropTypes.string,
  data: PropTypes.array
}

export default Chart
