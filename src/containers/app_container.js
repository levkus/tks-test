import { connect } from 'react-redux'
import App from '../components/app/app'
import { makeNewChart } from '../store/actions'

const mapStateToProps = state => ({
  data: state.data.data
})

export default connect(mapStateToProps, { makeNewChart })(App)
