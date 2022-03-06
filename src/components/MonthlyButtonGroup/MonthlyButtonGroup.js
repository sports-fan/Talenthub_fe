import React, { useCallback, useMemo } from 'react'
import { Button, Grid } from '@material-ui/core'
import { compose } from 'redux'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { NavigateBefore, NavigateNext } from '@material-ui/icons'

import useStyles from './styles'
import withPaginationInfo from 'hocs/withPaginationInfo'
import { parseQueryString, jsonToQueryString, generateDecrementArray, generateIncrementArray } from 'helpers/utils'

const MonthlyButtonGroup = ({ location, history }) => {
  let classes = useStyles()
  const queryObj = useMemo(() => parseQueryString(location.search), [location])
  const selectedYear = parseInt(queryObj.year) || new Date().getFullYear()
  const selectedMonth = parseInt(queryObj.month) || new Date().getMonth() + 1

  const handleYearChange = useCallback(
    eve => {
      history.push({
        search: jsonToQueryString({
          ...parseQueryString(location.search),
          year: eve.target.value,
          month: selectedMonth
        })
      })
    },
    [history, location, selectedMonth]
  )
  const handleMonthChange = useCallback(
    eve => {
      history.push({
        search: jsonToQueryString({
          ...parseQueryString(location.search),
          year: selectedYear,
          month: eve.target.value
        })
      })
    },
    [history, location, selectedYear]
  )

  const viewThisMonthLog = useCallback(() => {
    const date = new Date()
    history.push({
      search: jsonToQueryString({
        ...parseQueryString(location.search),
        year: date.getFullYear(),
        month: date.getMonth() + 1
      })
    })
  }, [history, location])

  const viewPrevMonthLog = useCallback(() => {
    const year = selectedMonth > 1 ? selectedYear : selectedYear - 1
    const month = selectedMonth > 1 ? selectedMonth - 1 : 12

    history.push({
      search: jsonToQueryString({
        ...parseQueryString(location.search),
        year,
        month
      })
    })
  }, [history, location, selectedMonth, selectedYear])

  const viewNextMonthLog = useCallback(() => {
    const year = selectedMonth < 12 ? selectedYear : selectedYear + 1
    const month = selectedMonth < 12 ? selectedMonth + 1 : 1

    history.push({
      search: jsonToQueryString({
        ...parseQueryString(location.search),
        year,
        month
      })
    })
  }, [history, location, selectedMonth, selectedYear])

  const yearArray = generateDecrementArray(new Date().getFullYear(), 10)
  const monthArray = generateIncrementArray(1, 12)

  return (
    <>
      <Grid item>
        <Button variant="outlined" color="primary" onClick={viewPrevMonthLog}>
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
        <Button variant="outlined" color="primary" onClick={viewNextMonthLog}>
          <NavigateNext />
        </Button>
      </Grid>
      <Grid item>
        <Button className={classes.button} onClick={viewThisMonthLog} variant="outlined" color="primary">
          this month
        </Button>
      </Grid>
    </>
  )
}

export default compose(withPaginationInfo)(MonthlyButtonGroup)
