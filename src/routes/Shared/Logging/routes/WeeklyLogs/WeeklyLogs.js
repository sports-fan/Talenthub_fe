import React, { useEffect, useMemo } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { format } from 'date-fns'

import { weeklyLogsSelector, getWeeklyLogs } from 'store/modules/logging'
import { meSelector } from 'store/modules/auth'
import LoggingLayout from 'routes/Shared/Logging/components/LoggingLayout'
import withPaginationInfo from 'hocs/withPaginationInfo'
import { parseQueryString } from 'helpers/utils'
import { ListDataType } from 'helpers/prop-types'
import WeeklyButtonGroup from 'components/WeeklyButtonGroup'

const WeeklyLogs = ({ getWeeklyLogs, weeklyLogs, me, pagination, location, history }) => {
  const queryObj = useMemo(() => parseQueryString(location.search), [location])
  const selectedYear = parseInt(queryObj.year) || new Date().getFullYear()
  const selectedWeek = parseInt(queryObj.week) || parseInt(format(new Date(), 'ww'))

  useEffect(() => {
    const { owner } = queryObj
    getWeeklyLogs({
      role: me.role,
      year: selectedYear,
      week: selectedWeek - 1,
      params: {
        pagination,
        owner
      }
    })
  }, [getWeeklyLogs, me.role, selectedYear, selectedWeek, pagination, queryObj])

  return <LoggingLayout title="Weekly Logs" interval="weekly" logs={weeklyLogs} actions={<WeeklyButtonGroup />} />
}

const actions = {
  getWeeklyLogs
}

const selectors = createStructuredSelector({
  weeklyLogs: weeklyLogsSelector,
  me: meSelector
})

WeeklyLogs.propTypes = {
  logs: ListDataType,
  me: PropTypes.object,
  getWeeklyLogs: PropTypes.func.isRequired,
  pagination: PropTypes.object.isRequired
}

export default compose(withPaginationInfo, connect(selectors, actions))(WeeklyLogs)
