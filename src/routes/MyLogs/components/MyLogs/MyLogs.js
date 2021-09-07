import React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import MyDailyLogs from 'routes/MyLogs/routes/MyDailyLogs'
import MyMonthlyLogs from 'routes/MyLogs/routes/MyMonthlyLogs'
import MyWeeklyLogs from 'routes/MyLogs/routes/MyWeeklyLogs'

const MyLogs = ({ match: { path } }) => {
  return (
    <Switch>
      <Route exact path={`${path}/daily`} component={MyDailyLogs} />
      <Route exact path={`${path}/monthly`} component={MyMonthlyLogs} />
      <Route exact path={`${path}/weekly`} component={MyWeeklyLogs} />
      <Redirect to={`${path}/daily`} />
    </Switch>
  )
}

export default MyLogs
