import React, { useCallback, useEffect, useMemo } from 'react'
import { Button, Grid, FormControl, MenuItem, Input, InputLabel, Select, Paper } from '@material-ui/core'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { format, addDays, subDays } from 'date-fns'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { NavigateBefore, NavigateNext } from '@material-ui/icons'

import { meSelector } from 'store/modules/auth'
import SimpleSelect from 'components/SimpleSelect'
import LocalizedDatePicker from 'components/LocalizedDatePicker'
import EditableSelect from 'components/EditableSelect'
import { searchUsers, userSearchResultsSelector } from 'store/modules/user'
import { generateDecrementArray, generateIncrementArray, getAsianFullName, dateStringToLocalDate } from 'helpers/utils'
import { getDate, datePickerLabelFunc } from '../../routes/utils'
import { LOG_OPTIONS, URL_PREFIXES, INTERVALS } from 'config/constants'
import useStyles from './styles'

const LoggingActionBar = ({ logDetail, history, match, me, interval, searchUsers, users }) => {
  const {
    params: { year, month, day, week, userId }
  } = match

  let classes = useStyles()

  const date = logDetail ? logDetail.created_at : undefined
  const selectedDate = getDate(date, year, month, week, day)
  const selectedUserId = logDetail ? logDetail.owner.id : parseInt(userId)
  const selectedYear = dateStringToLocalDate(selectedDate).getFullYear()
  const selectedMonth = dateStringToLocalDate(selectedDate).getMonth() + 1
  const selectedWeek = parseInt(format(dateStringToLocalDate(selectedDate), 'ww')) - 1
  const selectedDay = parseInt(format(dateStringToLocalDate(selectedDate), 'dd'))

  const handleIntervalChange = useCallback(
    event => {
      const interval = event.target.value
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth() + 1
      const day = today.getDate()
      const week = format(today, 'ww') - 1

      switch (interval) {
        case INTERVALS.DAILY:
          history.push(`/${URL_PREFIXES[me.role]}/logging/daily/${year}-${month}-${day}/${selectedUserId}`)
          break
        case INTERVALS.WEEKLY:
          history.push(`/${URL_PREFIXES[me.role]}/logging/weekly/${year}-${week}/${selectedUserId}`)
          break
        case INTERVALS.MONTHLY:
          history.push(`/${URL_PREFIXES[me.role]}/logging/monthly/${year}-${month}/${selectedUserId}`)
          break
        default:
          break
      }
    },
    [history, me.role, selectedUserId]
  )

  const handleDateChange = useCallback(
    date => {
      history.push(`/${URL_PREFIXES[me.role]}/logging/daily/${date}/${selectedUserId}`)
    },
    [history, selectedUserId, me.role]
  )

  const handleViewPrevDayLog = useCallback(() => {
    const prevDate = new subDays(dateStringToLocalDate(selectedDate), 1)
    history.push(`/${URL_PREFIXES[me.role]}/logging/daily/${format(prevDate, 'yyyy-MM-dd')}/${selectedUserId}`)
  }, [history, selectedUserId, me.role, selectedDate])

  const handleViewNextDayLog = useCallback(() => {
    const nextDate = new addDays(dateStringToLocalDate(selectedDate), 1)
    history.push(`/${URL_PREFIXES[me.role]}/logging/daily/${format(nextDate, 'yyyy-MM-dd')}/${selectedUserId}`)
  }, [history, selectedUserId, me.role, selectedDate])

  const handleWeekChange = useCallback(
    date => {
      const dt = new Date(date)
      const year = dt.getFullYear()
      const week = parseInt(format(dt, 'ww', { weekStartsOn: 1 })) - 1
      history.push(`/${URL_PREFIXES[me.role]}/logging/weekly/${year}-${week}/${selectedUserId}`)
    },
    [history, selectedUserId, me.role]
  )

  const handleThisWeekClick = useCallback(() => {
    const today = new Date()
    const year = today.getFullYear()
    const week = parseInt(format(today, 'ww')) - 1
    history.push(`/${URL_PREFIXES[me.role]}/logging/weekly/${year}-${week}/${selectedUserId}`)
  }, [history, selectedUserId, me.role])

  const handleViewNextWeekLog = useCallback(() => {
    const year = selectedWeek < 53 ? selectedYear : selectedYear + 1
    const week = selectedWeek < 53 ? selectedWeek + 1 : 1
    history.push(`/${URL_PREFIXES[me.role]}/logging/weekly/${year}-${week}/${selectedUserId}`)
  }, [history, selectedUserId, me.role, selectedWeek, selectedYear])

  const handleViewPrevWeekLog = useCallback(() => {
    const year = selectedWeek > 1 ? selectedYear : selectedYear - 1
    const week = selectedWeek > 1 ? selectedWeek - 1 : 53
    history.push(`/${URL_PREFIXES[me.role]}/logging/weekly/${year}-${week}/${selectedUserId}`)
  }, [history, selectedUserId, me.role, selectedWeek, selectedYear])

  const handleYearChange = useCallback(
    event => {
      const year = event.target.value
      history.push(`/${URL_PREFIXES[me.role]}/logging/monthly/${year}-${selectedMonth}/${selectedUserId}`)
    },
    [history, selectedMonth, me.role, selectedUserId]
  )

  const handleMonthChange = useCallback(
    event => {
      const month = event.target.value
      history.push(`/${URL_PREFIXES[me.role]}/logging/monthly/${selectedYear}-${month}/${selectedUserId}`)
    },
    [history, selectedYear, me.role, selectedUserId]
  )

  const handleViewPrevMonthLog = useCallback(() => {
    const year = selectedMonth > 1 ? selectedYear : selectedYear - 1
    const month = selectedMonth > 1 ? selectedMonth - 1 : 12

    history.push(`/${URL_PREFIXES[me.role]}/logging/monthly/${year}-${month}/${selectedUserId}`)
  }, [history, selectedYear, me.role, selectedUserId, selectedMonth])

  const handleViewNextMonthLog = useCallback(() => {
    const year = selectedMonth < 12 ? selectedYear : selectedYear + 1
    const month = selectedMonth < 12 ? selectedMonth + 1 : 1

    history.push(`/${URL_PREFIXES[me.role]}/logging/monthly/${year}-${month}/${selectedUserId}`)
  }, [history, selectedYear, me.role, selectedUserId, selectedMonth])

  const handleTodayClick = useCallback(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()
    history.push(`/${URL_PREFIXES[me.role]}/logging/daily/${year}-${month}-${day}/${selectedUserId}`)
  }, [history, selectedUserId, me.role])

  const handleThisMonthClick = useCallback(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    history.push(`/${URL_PREFIXES[me.role]}/logging/monthly/${year}-${month}/${selectedUserId}`)
  }, [history, selectedUserId, me.role])

  const yearArray = generateDecrementArray(new Date().getFullYear(), 10)
  const monthArray = generateIncrementArray(1, 12)

  useEffect(() => {
    searchUsers()
  }, [searchUsers])

  const userList = useMemo(() => {
    if (users) {
      return users.map(user => ({
        label: getAsianFullName(user),
        value: user.id
      }))
    } else {
      return []
    }
  }, [users])

  const handleUserChange = useCallback(
    userId => {
      switch (interval) {
        case INTERVALS.DAILY:
          history.push(
            `/${URL_PREFIXES[me.role]}/logging/daily/${selectedYear}-${selectedMonth}-${selectedDay}/${userId}`
          )
          break
        case INTERVALS.WEEKLY:
          history.push(`/${URL_PREFIXES[me.role]}/logging/weekly/${selectedYear}-${selectedWeek}/${userId}`)
          break
        case INTERVALS.MONTHLY:
          history.push(`/${URL_PREFIXES[me.role]}/logging/monthly/${selectedYear}-${selectedMonth}/${userId}`)
          break
        default:
          break
      }
    },
    [me, history, interval, selectedYear, selectedMonth, selectedWeek, selectedDay]
  )

  const handleViewPrevUserLog = useCallback(() => {
    const ownerId = logDetail ? parseInt(logDetail.owner.id) : users.filter(user => user.id === parseInt(userId))[0].id
    const index = users.map(user => user.id).indexOf(ownerId)

    if (index > 0) {
      const nextUserId = users[index - 1].id

      switch (interval) {
        case INTERVALS.DAILY:
          history.push(
            `/${URL_PREFIXES[me.role]}/logging/daily/${selectedYear}-${selectedMonth}-${selectedDay}/${nextUserId}`
          )
          break
        case INTERVALS.WEEKLY:
          history.push(`/${URL_PREFIXES[me.role]}/logging/weekly/${selectedYear}-${selectedWeek}/${nextUserId}`)
          break
        case INTERVALS.MONTHLY:
          history.push(`/${URL_PREFIXES[me.role]}/logging/monthly/${selectedYear}-${selectedMonth}/${nextUserId}`)
          break
        default:
          break
      }
    }
  }, [me, history, interval, users, logDetail, userId, selectedYear, selectedMonth, selectedWeek, selectedDay])

  const handleViewNextUserLog = useCallback(() => {
    const ownerId = logDetail ? parseInt(logDetail.owner.id) : users.filter(user => user.id === parseInt(userId))[0].id
    const index = users.map(user => user.id).indexOf(ownerId)

    if (index < users.length - 1) {
      const nextUserId = users[index + 1].id

      switch (interval) {
        case INTERVALS.DAILY:
          history.push(
            `/${URL_PREFIXES[me.role]}/logging/daily/${selectedYear}-${selectedMonth}-${selectedDay}/${nextUserId}`
          )
          break
        case INTERVALS.WEEKLY:
          history.push(`/${URL_PREFIXES[me.role]}/logging/weekly/${selectedYear}-${selectedWeek}/${nextUserId}`)
          break
        case INTERVALS.MONTHLY:
          history.push(`/${URL_PREFIXES[me.role]}/logging/monthly/${selectedYear}-${selectedMonth}/${nextUserId}`)
          break
        default:
          break
      }
    }
  }, [me, history, interval, users, logDetail, userId, selectedYear, selectedMonth, selectedWeek, selectedDay])

  return (
    <Paper>
      <Grid container>
        <Grid item sm={4} className={classes.userSelect}>
          <Grid container alignItems="stretch">
            <Grid item>
              <Button className={classes.pnButton} variant="outlined" color="primary" onClick={handleViewPrevUserLog}>
                <NavigateBefore />
              </Button>
            </Grid>
            <Grid item className={classes.selectComponent}>
              <EditableSelect
                options={userList}
                value={selectedUserId}
                onChange={handleUserChange}
                placeholder="Select User"
                isClearable={false}
              />
            </Grid>
            <Grid item>
              <Button className={classes.pnButton} variant="outlined" color="primary" onClick={handleViewNextUserLog}>
                <NavigateNext />
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={8} className={classes.datePick}>
          <Grid container className={classes.grid} spacing={5} alignItems="center" justifyContent="flex-end">
            <Grid item>
              <SimpleSelect label="Period" value={interval} options={LOG_OPTIONS} onChange={handleIntervalChange} />
            </Grid>
            {interval === INTERVALS.DAILY ? (
              <>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={handleViewPrevDayLog}>
                    <NavigateBefore />
                  </Button>
                </Grid>
                <Grid item>
                  <LocalizedDatePicker
                    margin="normal"
                    label="Choose a date"
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={handleViewNextDayLog}>
                    <NavigateNext />
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={handleTodayClick}>
                    Today
                  </Button>
                </Grid>
              </>
            ) : interval === INTERVALS.WEEKLY ? (
              <>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={handleViewPrevWeekLog}>
                    <NavigateBefore />
                  </Button>
                </Grid>
                <Grid item>
                  <LocalizedDatePicker
                    margin="normal"
                    label="Choose a week of month"
                    value={selectedDate}
                    onChange={handleWeekChange}
                    labelFunc={datePickerLabelFunc}
                  />
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={handleViewNextWeekLog}>
                    <NavigateNext />
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={handleThisWeekClick}>
                    This Week
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={handleViewPrevMonthLog}>
                    <NavigateBefore />
                  </Button>
                </Grid>
                <Grid item>
                  <form className={classes.container}>
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="year">Year</InputLabel>
                      <Select value={selectedYear} onChange={handleYearChange} input={<Input id="year" />}>
                        {yearArray.map((year, id) => (
                          <MenuItem key={id} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="month">Month</InputLabel>
                      <Select value={selectedMonth} onChange={handleMonthChange} input={<Input id="month" />}>
                        {monthArray.map((month, id) => (
                          <MenuItem key={id} value={month}>
                            {month}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </form>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={handleViewNextMonthLog}>
                    <NavigateNext />
                  </Button>
                </Grid>
                <Grid item>
                  <Button className={classes.button} onClick={handleThisMonthClick} variant="outlined" color="primary">
                    this month
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

const selectors = createStructuredSelector({
  me: meSelector,
  users: userSearchResultsSelector
})

const actions = {
  searchUsers
}

LoggingActionBar.propTypes = {
  logDetail: PropTypes.object,
  history: PropTypes.object.isRequired,
  me: PropTypes.object,
  match: PropTypes.object.isRequired,
  interval: PropTypes.string.isRequired
}

export default compose(withRouter, connect(selectors, actions))(LoggingActionBar)
