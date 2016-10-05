import React, { PureComponent, PropTypes } from 'react'
import _ from 'lodash'

class Triggers extends PureComponent {
  render () {
    const { points, deltaX, height, setTooltip } = this.props
    const triggers = _.map(points, point => (
      <rect x={point.x - (deltaX / 2)} y='0'
        key={_.uniqueId('trigger_')}
        width={deltaX}
        height={height}
        style={{ 'cursor': 'pointer' }}
        fill='transparent'
        onMouseEnter={setTooltip(point.x, point.y, point.date, point.value, point.prevValue)}
      />
    ))
    return <g>{triggers}</g>
  }
}

Triggers.propTypes = {
  points: PropTypes.array,
  deltaX: PropTypes.number,
  height: PropTypes.number,
  setTooltip: PropTypes.func
}

export default Triggers
