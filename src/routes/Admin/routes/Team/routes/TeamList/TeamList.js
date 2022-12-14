import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { Grid } from '@material-ui/core'
import { show } from 'redux-modal'

import { getTeams, teamsSelector, deleteTeamAndRefresh } from 'store/modules/team'

import Widget from 'components/Widget'
import Spinner from 'components/Spinner'
import TrackButton from 'components/TrackButton'
import TeamMemberExpansion from '../../components/TeamMemberExpansion'
import TeamUnassignedUsers from '../../components/TeamUnassignedUsers'

const TeamList = ({ getTeams, teams, show, deleteTeamAndRefresh }) => {
  useEffect(() => {
    !teams && getTeams()
  }, [teams, getTeams])

  const handleDeleteTeam = useCallback(
    id => {
      deleteTeamAndRefresh({
        id,
        message: 'Are you sure to delete the team?'
      })
    },
    [deleteTeamAndRefresh]
  )

  if (!teams) return <Spinner />
  else
    return (
      <Grid container>
        <Grid item xs={12}>
          <Widget
            title="Teams"
            disableWidgetMenu
            WidgetButton={
              <TrackButton trackType="push" color="primary" to="/admin/teams/new">
                Add a Team
              </TrackButton>
            }>
            {teams.map(team => (
              <TeamMemberExpansion
                key={team.id}
                teamId={team.id}
                teamName={team.name}
                onDeleteTeam={handleDeleteTeam}
              />
            ))}
            <TeamUnassignedUsers />
          </Widget>
        </Grid>
      </Grid>
    )
}

TeamList.propTypes = {
  getTeams: PropTypes.func.isRequired,
  teams: PropTypes.array,
  deleteTeamAndRefresh: PropTypes.func.isRequired,
  show: PropTypes.func.isRequired
}

const actions = {
  getTeams,
  deleteTeamAndRefresh,
  show
}

const selectors = createStructuredSelector({
  teams: teamsSelector
})

export default connect(selectors, actions)(TeamList)
