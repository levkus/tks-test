import React, { Component, PropTypes } from 'react'
import Chart from '../../containers/chart_container'
import styles from './app.scss'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      min: 0,
      max: 80,
      times: 72,
      start: '7/20/2013',
      end: '9/10/2016'
    }
  }
  componentWillMount () {
    const { min, max, times, start, end } = this.state
    this.props.makeNewChart(min, max, times, start, end)
  }

  makeNewChart = () => event => {
    const { min, max, times, start, end } = this.state
    this.props.makeNewChart(min, max, times, start, end)
  }

  onInputChange = key => event => {
    this.setState({ [key]: event.target.value })
  }

  render () {
    return (
      <div className={styles.container}>
        <div className={styles.settings}>
          <div className={styles.settingsSection}>
            <label className={styles.label} htmlFor='min'>Минимальное значение:</label>
            <input className={styles.input} id='min' value={this.state.min} onChange={this.onInputChange('min')} />
          </div>
          <div className={styles.settingsSection}>
            <label className={styles.label} htmlFor='max'>Максимальное значение:</label>
            <input className={styles.input} id='max' value={this.state.max} onChange={this.onInputChange('max')} />
          </div>
          <div className={styles.settingsSection}>
            <label className={styles.label} htmlFor='times'>Количество значений:</label>
            <input className={styles.input} id='times' value={this.state.times} onChange={this.onInputChange('times')} />
          </div>
          <div className={styles.settingsSection}>
            <label className={styles.label} htmlFor='start'>Начальная дата:</label>
            <input className={styles.input} id='start' value={this.state.start} onChange={this.onInputChange('start')} />
          </div>
          <div className={styles.settingsSection}>
            <label className={styles.label} htmlFor='end'>Конечная дата:</label>
            <input className={styles.input} id='end' value={this.state.end} onChange={this.onInputChange('end')} />
          </div>
        </div>
        <button className={styles.button} onClick={this.makeNewChart()}>Построить новый график</button>
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
