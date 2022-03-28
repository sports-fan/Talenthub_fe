import { useMemo, useEffect, useCallback } from 'react'
import { Grid } from '@material-ui/core'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { compose } from 'redux'

import { meSelector } from 'store/modules/auth'
import LogsTable from '../../components/LogsTable'
import Widget from 'components/Widget'
import useStyles from './styles'
import PeriodButtonGroup from 'components/PeriodButtonGroup'
import SimpleSelect from 'components/SimpleSelect'

import { ROLES } from 'config/constants'
import withPaginationInfo from 'hocs/withPaginationInfo'
import { ListDataType } from 'helpers/prop-types'
import { getTeams, teamsSelector } from 'store/modules/team'
import { withRouter } from 'react-router-dom'
import { parseQueryString, jsonToQueryString } from 'helpers/utils'

const LoggingLayout = ({
  title,
  interval,
  logs,
  actions,
  me,
  teams,
  getTeams,
  pagination,
  onChangePage,
  onChangeRowsPerPage,
  location,
  history
}) => {
  let classes = useStyles()
  const queryObj = useMemo(
    () => ({
      ...parseQueryString(location.search)
    }),
    [location.search]
  )

  useEffect(() => {
    getTeams()
  }, [getTeams])

  const teamOptions = useMemo(
    () => [
      { value: 'all', label: 'All' },
      ...(teams
        ? teams.map(team => ({
            value: team.id.toString(),
            label: team.name
          }))
        : [])
    ],
    [teams]
  )

  const handleTeamChange = useCallback(
    event => {
      let team = event.target.value
      if (team === 'all') team = ''
      history.push({
        search: jsonToQueryString({
          ...queryObj,
          team
        })
      })
    },
    [history, queryObj]
  )

  return (
    <Widget
      title={title}
      upperTitle
      noBodyPadding
      bodyClass={classes.tableOverflow}
      disableWidgetMenu
      disableWidgetButton={me.role === ROLES.DEVELOPER}
      WidgetButton={
        <Grid container className={classes.grid} spacing={2} alignItems="center" justifyContent="flex-end">
          <Grid item>
            <SimpleSelect
              label="Team"
              value={queryObj.team || 'all'}
              options={teamOptions}
              onChange={handleTeamChange}
            />
          </Grid>
          <Grid item>
            <PeriodButtonGroup selectedPeriod={interval} me={me} loggingOrMyLogs="logging" />
          </Grid>
          {actions}
        </Grid>
      }>
      <LogsTable
        data={logs}
        interval={interval}
        role={me.role}
        pagination={pagination}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
    </Widget>
  )
}

const actions = {
  getTeams
}

const selectors = createStructuredSelector({
  me: meSelector,
  teams: teamsSelector
})

LoggingLayout.propTypes = {
  logs: ListDataType,
  me: PropTypes.object,
  title: PropTypes.string.isRequired,
  interval: PropTypes.string.isRequired,
  pagination: PropTypes.object.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired
}

export default compose(withRouter, withPaginationInfo, connect(selectors, actions))(LoggingLayout)
