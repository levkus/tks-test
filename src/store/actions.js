export const MAKE_NEW_CHART = 'MAKE_NEW_CHART'
import _ from 'lodash'
import moment from 'moment'

export const makeNewChart = (min, max, times, start, end) => {
  const startDate = moment(start, 'DD.MM.YYYY')
  const endDate = moment(end, 'DD.MM.YYYY')
  const deltaDate = (endDate - startDate) / (times - 1)
  const newData = []
  let count = 0
  let date = new Date(startDate._d)
  _.times(times, () => {
    newData.push({
      id: count,
      date,
      value: _.round(_.random(min, max, true), 2)
    })
    date = new Date(Date.parse(date) + deltaDate)
    count++
  })
  return { type: MAKE_NEW_CHART, payload: newData }
}
