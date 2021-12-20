import React, { useEffect, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { Grid, Button } from '@material-ui/core'
import { format } from 'date-fns'
import PropTypes from 'prop-types'

import LogCard from 'routes/Shared/MyLogs/components/LogCard'
import LocalizedDatePicker from 'components/LocalizedDatePicker'
import MyLogLayout from 'routes/Shared/MyLogs/components/MyLogLayout'
import useStyles from './styles'
import { getMyWeeklyLog, createMyWeeklyLog, updateMyWeeklyLog, myWeeklylogSelector } from 'store/modules/mylogs'
import { parseQueryString, jsonToQueryString, getFirstDateOfWeek, getWeekOfMonth } from 'helpers/utils'
import { MyLogType } from 'helpers/prop-types'

const datePickerLabelFunc = (date, invalidLabel) => {
  const weekOfMonth = getWeekOfMonth(date)
  return `Week #${weekOfMonth} of ${format(date, 'MMM.yyyy')}`
}

const MyWeeklyLog = ({ getMyWeeklyLog, createMyWeeklyLog, updateMyWeeklyLog, myWeeklyLog, location, history }) => {
  const classes = useStyles()
  const queryObj = parseQueryString(location.search)
  const selectedYear = queryObj.year || new Date().getFullYear()
  const selectedWeek = parseInt(queryObj.week) - 1 || parseInt(format(new Date(), 'ww')) - 1
  const firstdayOfSelectedWeek = getFirstDateOfWeek(selectedYear, selectedWeek + 1)

  const handleDateChange = useCallback(
    date => {
      const dt = new Date(date)
      const year = dt.getFullYear()
      const week = parseInt(format(dt, 'ww'))
      getMyWeeklyLog({
        year: year,
        week: week - 1
      })

      history.push({
        search: jsonToQueryString({
          ...parseQueryString(location.search),
          year: year,
          week: week
        })
      })
    },
    [history, location, getMyWeeklyLog]
  )
  const viewThisWeekLog = useCallback(() => {
    const date = new Date()
    const year = date.getFullYear()
    const week = format(date, 'ww')
    getMyWeeklyLog({
      year: year,
      week: week - 1
    })
    history.push({
      search: jsonToQueryString({
        ...parseQueryString(location.search),
        year: year,
        week: week
      })
    })
  }, [history, location, getMyWeeklyLog])

  const handleSaveAchievements = useCallback(
    content => {
      if (myWeeklyLog) {
        updateMyWeeklyLog({
          id: myWeeklyLog.id,
          data: {
            achievements: content
          }
        })
      } else {
        createMyWeeklyLog({
          data: {
            plan: '',
            achievements: content,
            interval: 'weekly',
            created_at: firstdayOfSelectedWeek
          }
        })
      }
    },
    [updateMyWeeklyLog, createMyWeeklyLog, myWeeklyLog, firstdayOfSelectedWeek]
  )

  const handleSavePlan = useCallback(
    content => {
      if (myWeeklyLog) {
        updateMyWeeklyLog({
          id: myWeeklyLog.id,
          data: {
            plan: content
          }
        })
      } else {
        createMyWeeklyLog({
          data: {
            plan: content,
            achievements: '',
            interval: 'weekly',
            created_at: firstdayOfSelectedWeek
          }
        })
      }
    },
    [updateMyWeeklyLog, createMyWeeklyLog, myWeeklyLog, firstdayOfSelectedWeek]
  )

  useEffect(() => getMyWeeklyLog(), [getMyWeeklyLog])
  return (
    <MyLogLayout
      interval="weekly"
      actions={
        <Grid item className={classes.actions}>
          <LocalizedDatePicker
            margin="normal"
            label="Choose a week"
            value={firstdayOfSelectedWeek}
            onChange={handleDateChange}
            labelFunc={datePickerLabelFunc}
          />
          <Button margin="normal" variant="outlined" color="primary" onClick={viewThisWeekLog}>
            This Week
          </Button>
        </Grid>
      }>
      <Grid item xs={6}>
        <LogCard title="Plan" content={myWeeklyLog?.plan} onSave={handleSavePlan} />
      </Grid>
      <Grid item xs={6}>
        <LogCard title="Achievements" content={myWeeklyLog?.achievements} onSave={handleSaveAchievements} />
      </Grid>
    </MyLogLayout>
  )
}

const actions = {
  getMyWeeklyLog,
  createMyWeeklyLog,
  updateMyWeeklyLog
}

const selectors = createStructuredSelector({
  myWeeklyLog: myWeeklylogSelector
})

MyWeeklyLog.propTypes = {
  getMyWeeklyLog: PropTypes.func.isRequired,
  createMyWeeklyLog: PropTypes.func.isRequired,
  updateMyWeeklyLog: PropTypes.func.isRequired,
  myWeeklyLog: MyLogType,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default connect(selectors, actions)(withRouter(MyWeeklyLog))
