import React, { Component } from 'react'
import _ from 'lodash'
import styles from './app.scss'
import Chart from '../chart/chart'

class App extends Component {
  constructor () {
    super()

    this.state = {
      data: []
    }

    this.makeData = this.makeData.bind(this)
  }

  componentWillMount () {
    this.makeData()()
  }

  makeData (min = 0, max = 80, times = 72) {
    return event => {
      min = parseInt(Math.random() * (300 - 25) + 25)
      max = parseInt(Math.random() * (1000 - 400) + 400)
      const startDate = new Date(2015, 7, 1)
      const endDate = new Date(2016, 7, 31)
      const deltaDate = (endDate - startDate) / (times - 1)
      const newData = []
      let count = 0
      let date = startDate
      _.times(times, () => {
        newData.push({
          id: count,
          date,
          value: (Math.random() * (max - min) + min).toFixed(2)
        })
        date = new Date(Date.parse(date) + deltaDate)
        count++
      })
      this.setState({ data: newData })
    }
  }

  render () {
    return (
      <div>
        <Chart
          data={this.state.data}
          width={864}
          height={280}
          padding={20}
          lineClass={styles.line}
          axisTextClass={styles.axisText}
          pointClass={styles.point}
          tooltipClass={styles.tooltip}
          projectionClass={styles.projection}
          tooltipDateClass={styles.date}
          tooltipTextClass={styles.tooltipText}
          tooltipIncreaseClass={styles.tooltipIncrease}
          tooltipDecreaseClass={styles.tooltipDecrease}
          background='#F6F7F8'
        />
        <button onClick={this.makeData()}>New Data</button>
      </div>
    )
  }
}

export default App
