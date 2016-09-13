import { connect } from 'react-redux'
import Chart from '../components/chart/chart'
import { makeNewChart } from '../store/actions'

const mapStateToProps = state => ({
  data: state.data.data
})

export default connect(mapStateToProps, { makeNewChart })(Chart)
