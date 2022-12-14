import React, { useEffect } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { weeklyLogDetailSelector, getWeeklyLogDetail, getDailyLogs } from 'store/modules/logging'
import { meSelector } from 'store/modules/auth'
import WeeklyPlusDaily from '../../components/WeeklyPlusDaily'

const WeeklyLogDetail = ({ getWeeklyLogDetail, me, match, interval, weeklyLogDetail, getDailyLogs }) => {
  const {
    params: { id }
  } = match
  useEffect(() => {
    getWeeklyLogDetail({
      id: id,
      role: me.role
    })
  }, [getWeeklyLogDetail, me.role, id])

  const userId = weeklyLogDetail?.owner.id

  useEffect(() => {
    getDailyLogs({
      role: me.role,
      params: {
        owner: userId
      }
    })
  }, [getDailyLogs, me.role, userId])

  return <WeeklyPlusDaily interval={interval} />
}

const actions = {
  getWeeklyLogDetail,
  getDailyLogs
}

const selectors = createStructuredSelector({
  weeklyLogDetail: weeklyLogDetailSelector,
  me: meSelector
})

WeeklyLogDetail.propTypes = {
  weeklyLogDetail: PropTypes.object,
  me: PropTypes.object.isRequired,
  getWeeklyLogDetail: PropTypes.func.isRequired
}

export default connect(selectors, actions)(WeeklyLogDetail)
