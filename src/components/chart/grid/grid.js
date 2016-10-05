import React, { PureComponent, PropTypes } from 'react'
import _ from 'lodash'
import styles from './grid.scss'

class Grid extends PureComponent {
  renderY () {
    const { width, height, padding, yMin, yMax, offsetX } = this.props
    const gridY = (height - padding * 2) / 4
    const deltaVal = yMax - yMin
    let pos = padding
    let val = yMax
    return _.times(5, item => {
      const line = <g key={_.uniqueId('gridY_')}>
        <line
          className={styles.axisLine}
          x1={padding + offsetX}
          x2={width - padding}
          y1={pos}
          y2={pos}
          strokeWidth='0.8'
        />
        <text
          className={styles.axisText}
          x={padding + offsetX - 8}
          y={pos} textAnchor='end'>{val}</text>
      </g>
      pos += gridY
      val = val - deltaVal / 4
      return line
    })
  }

  renderX () {
    const { padding, height, dates, offsetX, deltaX } = this.props

    const countedMonths = []
    const countedYears = []
    let prevMonth = ''
    let prevYear = ''
    // Считаем количество месяцев и лет и добавляем в соответствующие массивы
    _.map(dates, date => {
      const newMonth = date
      if (!prevMonth || newMonth.getMonth() !== prevMonth.getMonth()) {
        countedMonths.push({ month: newMonth, count: 1 })
      } else {
        _.last(countedMonths).count++
      }

      const newYear = date.toLocaleString('ru', { year: 'numeric' })
      if (newYear !== prevYear) {
        countedYears.push({ year: newYear, count: 1 })
      } else {
        _.last(countedYears).count++
      }

      prevMonth = newMonth
      prevYear = newYear
    })

    // Устанавливаем формат вывода месяца в зависимости от количества месяцев
    let monthFormat = countedMonths.length > 12 ? '2-digit' : 'long'
    let months

    // Выводим на ось Х список месяцев если их количество не превышает 24
    if (countedMonths.length < 24) {
      let monthX = padding + offsetX
      months = _.map(countedMonths, month => {
        const monthText =
          <text key={_.uniqueId('month_')}
            className={styles.axisText} x={monthX} y={height}
          >{month.month.toLocaleString('ru', { month: monthFormat })}</text>
        monthX += month.count * deltaX
        return monthText
      })
    }

    let yearsOffsetY = countedMonths.length < 24 ? 20 : 0

    // Выводим список лет
    let yearX = padding + offsetX
    const years = _.map(countedYears, year => {
      const yearText =
        <text key={_.uniqueId('year_')} className={styles.axisText}
          x={yearX} y={height + yearsOffsetY}>{year.year}</text>
      yearX += year.count * deltaX
      return yearText
    })

    return <g>
      {months}
      {years}
    </g>
  }

  render () {
    return (
      <g>
        {this.renderX()}
        {this.renderY()}
      </g>
    )
  }
}

Grid.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  yMin: PropTypes.number,
  yMax: PropTypes.number,
  offsetX: PropTypes.number,
  deltaX: PropTypes.number,
  dates: PropTypes.array
}

export default Grid
