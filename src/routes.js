// We only need to import the modules necessary for initial render
import React from 'react'
import { Route, IndexRoute } from 'react-router'

import CoreLayout from 'layouts/core_layout'
import App from 'containers/app_container'

export default (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={App} />
  </Route>
)
