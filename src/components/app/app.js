import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import Chart from '../../containers/chart_container'
import styles from './app.scss'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      min: 0,
      max: 80,
      times: 72,
      start: '01.09.2015',
      end: '20.08.2016'
    }
  }

  componentWillMount () {
    const { min, max, times, start, end } = this.state
    this.props.makeNewChart(min, max, times, start, end)
  }

  makeNewChart = () => event => {
    const { min, max, times, start, end } = this.state
    event.preventDefault()
    this.props.makeNewChart(min, max, times, start, end)
  }

  onInputChange = key => event => {
    this.setState({ [key]: event.target.value })
  }

  onInputFocus = event => {
    event.target.select()
  }

  renderInputs = () => {
    const fields = [
      {
        key: 'min',
        name: 'Минимальное значение'
      },
      {
        key: 'max',
        name: 'Максимальное значение'
      },
      {
        key: 'times',
        name: 'Количество значений'
      },
      {
        key: 'start',
        name: 'Начальная дата'
      },
      {
        key: 'end',
        name: 'Конечная дата'
      }
    ]

    return _.map(fields, field => {
      return (
        <div className={styles.settingsSection} key={field.key}>
          <label className={styles.label} htmlFor={field.key}>{`${field.name}:`}</label>
          <input className={styles.input} id={field.key} value={this.state[field.key]}
            onChange={this.onInputChange(field.key)}
            onFocus={this.onInputFocus}
          />
        </div>
      )
    })
  }

  render () {
    return (
      <div className={styles.container}>
        <form onSubmit={this.makeNewChart}>
          <div className={styles.settings}>
            {this.renderInputs()}
          </div>
          <button className={styles.button} onClick={this.makeNewChart()}>Построить новый график</button>
        </form>
        <Chart
          data={this.props.data}
          width={800}
          height={280}
          padding={20}
          background='#F6F7F8'
        />
      </div>
    )
  }
}

App.propTypes = {
  makeNewChart: PropTypes.func,
  data: PropTypes.array
}

export default App
