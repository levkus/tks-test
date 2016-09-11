import React, { PureComponent, PropTypes } from 'react'
import styles from './graph.scss'

class Graph extends PureComponent {
  render () {
    return (
      <polyline
        fill='none'
        className={styles.line}
        points={this.props.points}
        pointerEvents='none'
      />
    )
  }
}

Graph.propTypes = {
  points: PropTypes.string
}

export default Graph
