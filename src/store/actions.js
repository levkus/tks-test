export const MAKE_NEW_CHART = 'MAKE_NEW_CHART'
import _ from 'lodash'

export const makeNewChart = (min, max, times, start, end) => {
  const startDate = new Date(Date.parse(start))
  const endDate = new Date(Date.parse(end))
  const deltaDate = (endDate - startDate) / (times - 1)
  const newData = []
  let count = 0
  let date = startDate
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
