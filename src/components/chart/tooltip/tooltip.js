import React, { PureComponent, PropTypes } from 'react'
import styles from './tooltip.scss'

class Tooltip extends PureComponent {
  render () {
    const { bottom, showTooltip, tooltip, offsetX, point } = this.props
    return (
      <svg style={{ opacity: showTooltip ? '1' : '0', transition: 'opacity .5s' }}>
        <filter id='shadow' height='130%'>
          <feGaussianBlur in='SourceAlpha' stdDeviation='1' /> // stdDeviation is how much to blur
          <feOffset dx='0' dy='1.5' result='offsetblur' /> // how much to offset
          <feComponentTransfer>
            <feFuncA type='linear' slope='0.15' />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode /> // this contains the offset blurred image
            <feMergeNode in='SourceGraphic' /> // this contains the element that the filter is applied to
          </feMerge>
        </filter>
        <g transform={`translate(${tooltip.x},${tooltip.y})`}>
          <rect width={130 + offsetX} height={50}
            className={styles.tooltip}
            x={0} y={0}
            filter='url(#shadow)'
          />
          <text className={styles.date} x={10} y={18}>
            {tooltip.date.toLocaleString('ru', { year: 'numeric', month: 'long', day: 'numeric' }).replace(' г.', '')}
          </text>
          <text className={styles.text} x={10} y={36}>
            {'$' + tooltip.value.toString().replace('.', ',')}
          </text>
          <g transform={`translate(${50 + offsetX}, 28)`} style={{ opacity: tooltip.prevValue ? '1' : '0' }}>
            <polygon
              className={tooltip.positive ? styles.increase : styles.decrease}
              points={tooltip.positive ? '0,8 4.5,0 9,8' : '0,0 4.5,8 9,0'}
            />
            <text
              className={tooltip.positive ? styles.increase : styles.decrease}
              x={12}
              y={8}>
              {(tooltip.value - tooltip.prevValue).toFixed(2).replace('.', ',')}
            </text>
          </g>
        </g>
        <line x1={point.x} x2={point.x}
          y1={bottom}
          y2={point.y}
          className={styles.projection}
        />
        <circle cx={point.x} cy={point.y} className={styles.point} />
      </svg>
    )
  }
}

Tooltip.propTypes = {
  bottom: PropTypes.number,
  showTooltip: PropTypes.bool,
  tooltip: PropTypes.object,
  offsetX: PropTypes.number,
  point: PropTypes.object
}

export default Tooltip
