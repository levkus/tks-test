import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

class Chart extends Component {
  constructor (props) {
    super(props)

    this.renderPopup = this.renderPopup.bind(this)
    this.removePopup = this.removePopup.bind(this)

    this.state = {
      points: [],
      yMin: NaN,
      yMax: NaN,
      deltaX: NaN,
      deltaY: NaN,
      polylineCoordinates: ''
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

  parseData (data, width, height, padding) {
    // Считаем расстояние между точками по горизонтали
    const deltaX = ((width - padding * 2) / (data.length - 1)).toFixed(2)

    // Заполняем массив 'points' объектами с горизонтальными координатами точек и их значениями
    // Заодно записываем все значения в формате polyline в отдельный массив 'values'
    const points = []
    const values = []
    let count = 0
    _.map(data, item => {
      const point = {
        x: parseInt((count * deltaX).toFixed(2)) + padding,
        value: item.value
      }
      values.push(item.value)
      points.push(point)
      count++
    })

    // Находим минимальное и максимальное значение из массива 'values'
    let yMin = Math.floor(Math.min.apply(null, values))
    let yMax = Math.ceil(Math.max.apply(null, values))
    yMin = Math.round(yMin / 10) * 10
    yMax = Math.round(yMax / 10) * 10

    // Находим частное высоты графика и разницы максимального и минимального значений
    const deltaY = ((height - padding * 2) / (yMax - yMin)).toFixed(2)

    // Добавляем объектам в массиве вертикальные координаты
    _.map(points, point => {
      point.y = padding + parseInt(((yMax - point.value) * deltaY).toFixed(2))
    })

    // Собираем координаты точек в одну строку
    let polylineCoordinates = ''
    _.map(points, point => {
      polylineCoordinates += `${point.x},${point.y} `
    })

    // Записываем собранные данные в state
    this.setState({ deltaX, deltaY, points, yMin, yMax, polylineCoordinates })
  }

  renderData () {
    const { height, lineClass } = this.props

    return (
      <g>
        <polyline fill='none' points={this.state.polylineCoordinates} className={lineClass} />
        {_.map(this.state.points, point => {
          const id = _.uniqueId()
          return (
            <rect x={point.x - (this.state.deltaX / 2)} y='0'
              key={id}
              style={{ 'cursor': 'pointer' }}
              width={this.state.deltaX}
              height={height}
              fill='transparent'
              onMouseOver={this.renderPopup(point.x, point.y, point.value, id)}
              onMouseLeave={this.removePopup(id)}
            />
          )
        }
        )}
      </g>
    )
  }

  renderPopup (x, y, value, id) {
    return event => {
      // Создаем popup
      const popup = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      popup.setAttribute('id', 'popup_' + id)
      popup.setAttribute('x', x + 122 < this.props.width ? x + 2 : x - 122)
      popup.setAttribute('y', y - 58 > 10 ? y - 58 : y + 8)
      popup.setAttribute('width', 120)
      popup.setAttribute('height', 50)
      popup.setAttribute('fill', '#fff')
      popup.setAttribute('rx', 5)
      popup.setAttribute('ry', 5)
      popup.setAttribute('pointer-events', 'none')
      popup.setAttribute('filter', 'url(#shadow)')

      // Создаем точку
      const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      point.setAttribute('id', 'point_' + id)
      point.setAttribute('cx', x)
      point.setAttribute('cy', y)
      point.setAttribute('r', 4)
      point.setAttribute('stroke-width', 2)
      point.setAttribute('fill', '#74A3C7')
      point.setAttribute('stroke', '#F6F7F8')
      point.setAttribute('pointer-events', 'none')

      // Создаем проекцию
      const projection = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      projection.setAttribute('id', 'projection_' + id)
      projection.setAttribute('x1', x)
      projection.setAttribute('x2', x)
      projection.setAttribute('y1', this.props.height - this.props.padding)
      projection.setAttribute('y2', y)
      projection.setAttribute('stroke', '#D5D8D9')
      projection.setAttribute('stroke-dasharray', '5,5')
      projection.setAttribute('pointer-events', 'none')

      // Создаем текст
      const textValue = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      textValue.setAttribute('x', x + 122 < this.props.width ? x + 12 : x - 112)
      textValue.setAttribute('y', y - 58 > 10 ? y - 36 : y + 28)
      textValue.setAttribute('id', 'value_' + id)
      const valueNode = document.createTextNode(value)
      textValue.appendChild(valueNode)

      // Добавляем созданные элементы на график
      this.refs.chart.appendChild(popup)
      this.refs.chart.appendChild(point)
      this.refs.chart.appendChild(projection)
      this.refs.chart.appendChild(textValue)
    }
  }

  removePopup (id) {
    return event => {
      this.refs.chart.removeChild(document.getElementById('popup_' + id))
      this.refs.chart.removeChild(document.getElementById('point_' + id))
      this.refs.chart.removeChild(document.getElementById('projection_' + id))
      this.refs.chart.removeChild(document.getElementById('value_' + id))
    }
  }

  render () {
    const { width, height, background, padding } = this.props
    return (
      <div>
        <svg width={width} height={height + 20} ref='chart'>
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
          {this.renderData()}
          <line x1={padding} x2={width - padding} y1={height - padding} y2={height - padding} stroke='#E5E7E9' />
          <line x1={padding} x2={width - padding} y1={padding} y2={padding} stroke='#E5E7E9' />
          <text x={0} y={padding}>{this.state.yMax}</text>
          <text x={0} y={height - padding}>{this.state.yMin}</text>
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
  pointClass: PropTypes.string,
  background: PropTypes.string,
  data: PropTypes.array
}

export default Chart
