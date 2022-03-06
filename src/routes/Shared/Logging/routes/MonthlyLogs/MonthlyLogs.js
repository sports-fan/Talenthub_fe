import React, { useEffect, useMemo } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { compose } from 'redux'

import { monthlyLogsSelector, getMonthlyLogs } from 'store/modules/logging'
import { meSelector } from 'store/modules/auth'
import LoggingLayout from 'routes/Shared/Logging/components/LoggingLayout'
import withPaginationInfo from 'hocs/withPaginationInfo'
import { parseQueryString } from 'helpers/utils'
import { ListDataType } from 'helpers/prop-types'
import MonthlyButtonGroup from 'components/MonthlyButtonGroup'

const MonthlyLogs = ({ getMonthlyLogs, monthlyLogs, me, pagination, location, history }) => {
  const queryObj = useMemo(() => parseQueryString(location.search), [location])
  const selectedYear = parseInt(queryObj.year) || new Date().getFullYear()
  const selectedMonth = parseInt(queryObj.month) || new Date().getMonth() + 1

  useEffect(() => {
    const { owner } = queryObj
    getMonthlyLogs({
      role: me.role,
      year: selectedYear,
      month: selectedMonth,
      params: {
        pagination,
        owner
      }
    })
  }, [getMonthlyLogs, me.role, selectedMonth, selectedYear, pagination, queryObj])

  return <LoggingLayout title="Monthly Logs" interval="monthly" logs={monthlyLogs} actions={<MonthlyButtonGroup />} />
}

const actions = {
  getMonthlyLogs
}

const selectors = createStructuredSelector({
  monthlyLogs: monthlyLogsSelector,
  me: meSelector
})

MonthlyLogs.propTypes = {
  monthlyLogs: ListDataType,
  me: PropTypes.object,
  getMonthlyLogs: PropTypes.func.isRequired,
  pagination: PropTypes.object.isRequired
}

export default compose(withPaginationInfo, connect(selectors, actions))(MonthlyLogs)
