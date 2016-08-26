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

  makeData (min = 50, max = 70, times = 40) {
    return event => {
      const newData = []
      let count = 0
      _.times(times, () => {
        newData.push({ id: count, date: '', value: (Math.random() * (max - min) + min).toFixed(2) })
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
          pointClass={styles.point}
          background='#F6F7F8'
        />
        <button onClick={this.makeData()}>New Data</button>
      </div>
    )
  }
}

export default App
