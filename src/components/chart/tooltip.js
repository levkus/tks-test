import React, { PropTypes } from 'react'

const Tooltip = ({ bottom, showTooltip, tooltip, offsetX, tooltipClass, tooltipDateClass, tooltipTextClass,
                   tooltipIncreaseClass, tooltipDecreaseClass, point, projectionClass, pointClass }) => {
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
          className={tooltipClass}
          x={0} y={0}
          filter='url(#shadow)'
        />
        <text className={tooltipDateClass} x={10} y={18}>
          {tooltip.date.toLocaleString('ru', { year: 'numeric', month: 'long', day: 'numeric' }).replace(' г.', '')}
        </text>
        <text className={tooltipTextClass} x={10} y={36}>
          {'$' + tooltip.value.toString().replace('.', ',')}
        </text>
        <g transform={`translate(${50 + offsetX}, 28)`} style={{ opacity: tooltip.prevValue ? '1' : '0' }}>
          <polygon
            className={tooltip.positive ? tooltipIncreaseClass : tooltipDecreaseClass}
            points={tooltip.positive ? '0,8 4.5,0 9,8' : '0,0 4.5,8 9,0'}
          />
          <text
            className={tooltip.positive ? tooltipIncreaseClass : tooltipDecreaseClass}
            x={12}
            y={8}>
            {(tooltip.value - tooltip.prevValue).toFixed(2).replace('.', ',')}
          </text>
        </g>
      </g>
      <line x1={point.x} x2={point.x}
        y1={bottom}
        y2={point.y}
        className={projectionClass}
      />
      <circle cx={point.x} cy={point.y} className={pointClass} />
    </svg>
  )
}

Tooltip.propTypes = {
  pointClass: PropTypes.string,
  tooltipClass: PropTypes.string,
  projectionClass: PropTypes.string,
  tooltipDateClass: PropTypes.string,
  tooltipTextClass: PropTypes.string,
  tooltipIncreaseClass: PropTypes.string,
  tooltipDecreaseClass: PropTypes.string,
  bottom: PropTypes.number,
  showTooltip: PropTypes.bool,
  tooltip: PropTypes.object,
  offsetX: PropTypes.number,
  point: PropTypes.object
}

export default Tooltip
