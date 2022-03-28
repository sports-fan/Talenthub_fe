import React, { useEffect, useCallback } from 'react'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { show } from 'redux-modal'
import { compose } from 'redux'

import { getUsers, usersSelector, deleteUserAndRefresh } from 'store/modules/user'
import { meSelector } from 'store/modules/auth'
import UserTable from '../../components/UserTable'
import Widget from 'components/Widget'
import TrackButton from 'components/TrackButton'
import { ROLES, URL_PREFIXES } from 'config/constants'
import withPaginationInfo from 'hocs/withPaginationInfo'
import { ListDataType } from 'helpers/prop-types'

const useStyles = makeStyles(theme => ({
  tableOverflow: {
    overflow: 'auto'
  }
}))

const UserList = ({
  getUsers,
  users,
  me,
  location,
  history,
  deleteUserAndRefresh,
  show,
  pagination,
  onChangePage,
  onChangeRowsPerPage
}) => {
  let classes = useStyles()
  useEffect(() => {
    getUsers({
      role: me.role,
      params: pagination
    })
  }, [getUsers, me.role, pagination])

  const handleDelete = useCallback(
    id => {
      deleteUserAndRefresh({
        id,
        message: 'Are you sure to delete this user?'
      })
    },
    [deleteUserAndRefresh]
  )

  return (
    <>
      {/* <PageTitle title="Users" /> */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Widget
            title="Users"
            upperTitle
            noBodyPadding
            bodyClass={classes.tableOverflow}
            disableWidgetMenu
            disableWidgetButton={me.role !== ROLES.ADMIN}
            WidgetButton={
              <TrackButton trackType="push" color="primary" to={`/${URL_PREFIXES[me.role]}/users/new`}>
                Add a User
              </TrackButton>
            }>
            <UserTable
              data={users}
              role={me.role}
              handleDelete={handleDelete}
              pagination={pagination}
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          </Widget>
        </Grid>
      </Grid>
    </>
  )
}

const actions = {
  getUsers,
  deleteUserAndRefresh,
  show
}

const selectors = createStructuredSelector({
  users: usersSelector,
  me: meSelector
})

UserList.propTypes = {
  users: ListDataType,
  me: PropTypes.object,
  getUsers: PropTypes.func.isRequired,
  deleteUserAndRefresh: PropTypes.func.isRequired,
  show: PropTypes.func.isRequired,
  pagination: PropTypes.object.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired
}

export default compose(withPaginationInfo, withRouter, connect(selectors, actions))(UserList)
