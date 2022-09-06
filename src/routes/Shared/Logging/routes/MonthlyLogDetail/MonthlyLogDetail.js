import React, { useEffect } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import MonthlyPlusWeekly from '../../components/MonthlyPlusWeekly'
import { monthlyLogDetailSelector, getMonthlyLogDetail, getWeeklyLogs } from 'store/modules/logging'
import { meSelector } from 'store/modules/auth'

const MonthlyLogDetail = ({ getMonthlyLogDetail, me, match, interval, monthlyLogDetail, getWeeklyLogs }) => {
  const {
    params: { id }
  } = match

  useEffect(() => {
    getMonthlyLogDetail({
      id: id,
      role: me.role
    })
  }, [getMonthlyLogDetail, me.role, id])

  const userId = monthlyLogDetail?.owner.id

  useEffect(() => {
    getWeeklyLogs({
      role: me.role,
      params: {
        owner: userId
      }
    })
  }, [getWeeklyLogs, me.role, userId])

  return <MonthlyPlusWeekly interval={interval} />
}

const actions = {
  getMonthlyLogDetail,
  getWeeklyLogs
}

const selectors = createStructuredSelector({
  monthlyLogDetail: monthlyLogDetailSelector,
  me: meSelector
})

MonthlyLogDetail.propTypes = {
  monthlyLogDetail: PropTypes.object,
  me: PropTypes.object.isRequired,
  getMonthlyLogDetail: PropTypes.func.isRequired
}

export default connect(selectors, actions)(MonthlyLogDetail)
