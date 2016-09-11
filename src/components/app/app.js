import React, { Component } from 'react'
import _ from 'lodash'
import Chart from '../chart/chart'

class App extends Component {
  constructor () {
    super()

    this.state = {
      data: []
    }
  }

  componentWillMount () {
    this.makeData()()
  }

  makeData = (min = 0, max = 80, times = 500) => (event) => {
    min = _.random(25, 300)
    max = _.random(400, 20000)
    const startDate = new Date(2013, 7, 1)
    const endDate = new Date(2016, 7, 31)
    const deltaDate = (endDate - startDate) / (times - 1)
    const newData = []
    let count = 0
    let date = startDate
    _.times(times, () => {
      newData.push({
        id: count,
        date,
        value: _.random(min, max, true).toFixed(2)
      })
      date = new Date(Date.parse(date) + deltaDate)
      count++
    })
    this.setState({ data: newData })
  }

  render () {
    return (
      <div>
        <Chart
          data={this.state.data}
          width={864}
          height={280}
          padding={20}
          background='#F6F7F8'
        />
        <button onClick={this.makeData()}>New Data</button>
      </div>
    )
  }
}

export default App
