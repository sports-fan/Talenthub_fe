import React, { useEffect, useCallback } from 'react'
import { Grid } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { show } from 'redux-modal'

import Widget from 'components/Widget'
import ProjectsTable from '../../components/ProjectTable'
import Spinner from 'components/Spinner'
import TrackButton from 'components/TrackButton'
import { getProjects, deleteProjectAndRefresh, projectsSelector, projectsLoadingSelector } from 'store/modules/project'
import { meSelector } from 'store/modules/auth'
import withPaginationInfo from 'hocs/withPaginationInfo'
import { ListDataType } from 'helpers/prop-types'
import { URL_PREFIXES } from 'config/constants'

const ProjectList = ({
  getProjects,
  deleteProjectAndRefresh,
  projects,
  isProjectsLoading,
  me,
  match: { path },
  location,
  history,
  show,
  pagination,
  onChangePage,
  onChangeRowsPerPage
}) => {
  useEffect(() => {
    getProjects({
      me: me,
      params: pagination
    })
  }, [getProjects, me, pagination])

  const handleDelete = useCallback(
    id => {
      deleteProjectAndRefresh({
        id,
        role: me.role,
        message: 'Are you sure to delete the project?'
      })
    },
    [me.role, deleteProjectAndRefresh]
  )

  if (isProjectsLoading) return <Spinner />
  else
    return (
      <Grid container>
        <Grid item xs={12}>
          <Widget
            title="Projects"
            disableWidgetMenu
            WidgetButton={
              <TrackButton trackType="push" color="primary" to={`/${URL_PREFIXES[me.role]}/projects/new`}>
                Add a Project
              </TrackButton>
            }>
            <ProjectsTable
              data={projects}
              role={me.role}
              onDelete={handleDelete}
              pagination={pagination}
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          </Widget>
        </Grid>
      </Grid>
    )
}

const actions = {
  getProjects,
  deleteProjectAndRefresh,
  show
}

const selectors = createStructuredSelector({
  projects: projectsSelector,
  isProjectsLoading: projectsLoadingSelector,
  me: meSelector
})

ProjectList.propTypes = {
  getProjects: PropTypes.func.isRequired,
  deleteProjectAndRefresh: PropTypes.func.isRequired,
  projects: ListDataType,
  isProjectsLoading: PropTypes.bool.isRequired,
  me: PropTypes.object,
  match: PropTypes.object.isRequired,
  pagination: PropTypes.object
}

export default compose(withRouter, withPaginationInfo, connect(selectors, actions))(ProjectList)
