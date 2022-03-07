import React, { useCallback, useMemo } from 'react'
import { Grid, Button } from '@material-ui/core'
import { NavigateBefore, NavigateNext } from '@material-ui/icons'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { format } from 'date-fns'

import LocalizedDatePicker from 'components/LocalizedDatePicker'
import withPaginationInfo from 'hocs/withPaginationInfo'
import { parseQueryString, jsonToQueryString, getFirstDateOfWeek, getWeekOfMonth } from 'helpers/utils'

const datePickerLabelFunc = (date, invalidLabel) => {
  const weekOfMonth = getWeekOfMonth(date)
  return `Week #${weekOfMonth} of ${format(date, 'MMM. yyyy')}`
}

const WeeklyButtonGroup = ({ detail = false, location, history }) => {
  const queryObj = useMemo(() => parseQueryString(location.search), [location])
  const selectedYear = parseInt(queryObj.year) || new Date().getFullYear()
  const selectedWeek = parseInt(queryObj.week) || parseInt(format(new Date(), 'ww'))
  const firstdayOfSelectedWeek = getFirstDateOfWeek(selectedYear, selectedWeek)

  const handleDateChange = useCallback(
    date => {
      const dt = new Date(date)
      const year = dt.getFullYear()
      const week = parseInt(format(dt, 'ww'))
      history.push({
        search: jsonToQueryString({
          ...parseQueryString(location.search),
          year: year,
          week: week
        })
      })
    },
    [history, location]
  )

  const handleViewThisWeekLog = useCallback(() => {
    const date = new Date()
    const year = date.getFullYear()
    const week = format(date, 'ww')

    history.push({
      search: jsonToQueryString({
        ...parseQueryString(location.search),
        year: year,
        week: week
      })
    })
  }, [history, location])

  const handleViewPrevWeekLog = useCallback(() => {
    const year = selectedWeek > 1 ? selectedYear : selectedYear - 1
    const week = selectedWeek > 1 ? selectedWeek - 1 : 53

    history.push({
      search: jsonToQueryString({
        ...parseQueryString(location.search),
        year,
        week
      })
    })
  }, [history, location, selectedYear, selectedWeek])

  const handleViewNextWeekLog = useCallback(() => {
    const year = selectedWeek < 53 ? selectedYear : selectedYear + 1
    const week = selectedWeek < 53 ? selectedWeek + 1 : 1

    history.push({
      search: jsonToQueryString({
        ...parseQueryString(location.search),
        year,
        week
      })
    })
  }, [history, location, selectedYear, selectedWeek])
  return (
    <>
      <Grid item>
        <Button variant="outlined" color="primary" onClick={handleViewPrevWeekLog}>
          <NavigateBefore />
        </Button>
      </Grid>
      <Grid item>
        <LocalizedDatePicker
          margin="normal"
          label="Choose a date of week"
          value={firstdayOfSelectedWeek}
          onChange={handleDateChange}
          labelFunc={datePickerLabelFunc}
        />
      </Grid>
      <Grid item>
        <Button variant="outlined" color="primary" onClick={handleViewNextWeekLog}>
          <NavigateNext />
        </Button>
      </Grid>
      <Grid item>
        <Button variant="outlined" color="primary" onClick={handleViewThisWeekLog}>
          This Week
        </Button>
      </Grid>
    </>
  )
}

WeeklyButtonGroup.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default compose(withPaginationInfo)(WeeklyButtonGroup)
