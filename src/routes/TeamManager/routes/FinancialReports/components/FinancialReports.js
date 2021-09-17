import React from 'react'
import { Redirect, Switch, Route } from 'react-router'
import PropTypes from 'prop-types'

import Transaction from 'routes/Shared/Transaction'
import TeamReportList from 'routes/Admin/routes/Reports/routes/TeamReportList'

const Reports = ({ match: { path } }) => (
  <Switch>
    <Route path={`${path}/transactions`} component={Transaction} />
    <Route path={`${path}/my-team-reports`} component={TeamReportList} />
    <Redirect to={`${path}/transactions`} />
  </Switch>
)

Reports.propTypes = {
  match: PropTypes.object.isRequired
}

export default Reports
