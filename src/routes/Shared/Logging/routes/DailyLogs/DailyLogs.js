import React, { useEffect, useMemo } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { format } from 'date-fns'
import PropTypes from 'prop-types'

import withPaginationInfo from 'hocs/withPaginationInfo'
import LoggingLayout from 'routes/Shared/Logging/components/LoggingLayout'
import DailyButtonGroup from 'components/DailyButtonGroup'
import { parseQueryString } from 'helpers/utils'
import { meSelector } from 'store/modules/auth'
import { ListDataType } from 'helpers/prop-types'
import { dailyLogsSelector, getDailyLogs } from 'store/modules/logging'

const DailyLogs = ({ getDailyLogs, dailyLogs, me, pagination, location, history, match }) => {
  const queryObj = useMemo(() => parseQueryString(location.search), [location])
  const selectedDate = queryObj.date || format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    const { owner, team } = queryObj
    getDailyLogs({
      role: me.role,
      date: selectedDate,
      params: {
        pagination,
        owner,
        team
      }
    })
  }, [getDailyLogs, me.role, selectedDate, pagination, queryObj])

  return <LoggingLayout title="Daily Logs" interval="daily" logs={dailyLogs} actions={<DailyButtonGroup />} />
}

const actions = {
  getDailyLogs
}

const selectors = createStructuredSelector({
  dailyLogs: dailyLogsSelector,
  me: meSelector
})

DailyLogs.propTypes = {
  logs: ListDataType,
  me: PropTypes.object,
  getDailyLogs: PropTypes.func.isRequired,
  pagination: PropTypes.object.isRequired
}

export default compose(withPaginationInfo, connect(selectors, actions))(DailyLogs)
