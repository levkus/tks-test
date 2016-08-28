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

  makeData (min = 0, max = 80, times = 60) {
    return event => {
      const newData = []
      let date = new Date()
      let count = 0
      _.times(times, () => {
        newData.push({ id: count, date: date, value: (Math.random() * (max - min) + min).toFixed(2) })
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
          width={window.innerWidth}
          height={280}
          padding={20}
          lineClass={styles.line}
          axisTextClass={styles.axisText}
          pointClass={styles.point}
          popupClass={styles.popup}
          projectionClass={styles.projection}
          popupTextClass={styles.popupText}
          popupIncreaseClass={styles.popupIncrease}
          popupDecreaseClass={styles.popupDecrease}
          background='#F6F7F8'
        />
        <button onClick={this.makeData()}>New Data</button>
      </div>
    )
  }
}

export default App
