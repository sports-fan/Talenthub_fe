import React, { useCallback, useMemo } from 'react'
import { compose } from 'redux'
import { format } from 'date-fns'
import { Grid, Button } from '@material-ui/core'
import { NavigateBefore, NavigateNext } from '@material-ui/icons'
import PropTypes from 'prop-types'

import withPaginationInfo from 'hocs/withPaginationInfo'
import LocalizedDatePicker from 'components/LocalizedDatePicker'
import { parseQueryString, jsonToQueryString } from 'helpers/utils'

const DailyButtonGroup = ({ location, history }) => {
  const queryObj = useMemo(() => parseQueryString(location.search), [location])
  const selectedDate = queryObj.date || format(new Date(), 'yyyy-MM-dd')

  const oneDayPeriod = 86400000
  const previousDateOfSelectedDate = useMemo(() => new Date(new Date(selectedDate).getTime() - oneDayPeriod), [
    selectedDate
  ])
  const nextDateofSelectedDate = useMemo(() => new Date(new Date(selectedDate).getTime() + oneDayPeriod), [
    selectedDate
  ])

  const handleDateChange = useCallback(
    date => {
      history.push({
        search: jsonToQueryString({
          ...parseQueryString(location.search),
          date
        })
      })
    },
    [history, location]
  )

  const viewTodayLog = useCallback(() => {
    const date = Date.now()
    history.push({
      search: jsonToQueryString({
        ...parseQueryString(location.search),
        date: format(date, 'yyyy-MM-dd')
      })
    })
  }, [history, location])

  const viewPrevDayLog = useCallback(() => {
    history.push({
      search: jsonToQueryString({
        ...parseQueryString(location.search),
        date: format(previousDateOfSelectedDate, 'yyyy-MM-dd')
      })
    })
  }, [history, location, previousDateOfSelectedDate])

  const viewNextDayLog = useCallback(() => {
    history.push({
      search: jsonToQueryString({
        ...parseQueryString(location.search),
        date: format(nextDateofSelectedDate, 'yyyy-MM-dd')
      })
    })
  }, [history, location, nextDateofSelectedDate])

  return (
    <>
      <Grid item>
        <Button variant="outlined" color="primary" onClick={viewPrevDayLog}>
          <NavigateBefore />
        </Button>
      </Grid>
      <Grid item>
        <LocalizedDatePicker margin="normal" label="Choose a date" value={selectedDate} onChange={handleDateChange} />
      </Grid>
      <Grid item>
        <Button variant="outlined" color="primary" onClick={viewNextDayLog}>
          <NavigateNext />
        </Button>
      </Grid>
      <Grid item>
        <Button variant="outlined" color="primary" onClick={viewTodayLog}>
          Today
        </Button>
      </Grid>
    </>
  )
}

DailyButtonGroup.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default compose(withPaginationInfo)(DailyButtonGroup)
