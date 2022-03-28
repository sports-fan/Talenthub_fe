import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  Chip,
  Tooltip,
  IconButton
} from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { compose } from 'redux'

import useStyles from './styles'
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons'
import { ROLES, URL_PREFIXES } from 'config/constants'
import Spinner from 'components/Spinner'
import { ListDataType } from 'helpers/prop-types'
import { meSelector } from 'store/modules/auth'
import TrackButton from 'components/TrackButton'

const role_patterns = [
  {
    id: 0,
    role: null,
    color: ''
  },
  {
    id: ROLES.ADMIN,
    role: 'AD',
    color: 'success'
  },
  {
    id: ROLES.TEAM_MANAGER,
    role: 'TM',
    color: 'warning'
  },
  {
    id: ROLES.DEVELOPER,
    role: 'DV',
    color: 'secondary'
  }
]

const columns = ['Full name', 'Email', 'Role', 'Actions']

function UserTable({
  me,
  data,
  role: myRole,
  handleDelete,
  match: { path },
  location,
  history,
  pagination,
  onChangePage,
  onChangeRowsPerPage
}) {
  const classes = useStyles()

  if (data) {
    return (
      <Table className="mb-0">
        <TableHead>
          <TableRow>
            {columns.map(key => (
              <TableCell key={key}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.results.map(({ id, email, first_name, last_name, role }) => (
            <TableRow key={email} hover>
              <TableCell>
                {last_name} {first_name}
              </TableCell>
              <TableCell>{email}</TableCell>
              <TableCell>
                <Chip label={role_patterns[role].role} classes={{ root: classes[role_patterns[role].color] }} />
              </TableCell>
              {[ROLES.ADMIN, ROLES.TEAM_MANAGER].includes(myRole) && (
                <TableCell className={classes.action}>
                  <Tooltip key={`${id}Edit`} title="Edit" placement="top">
                    <TrackButton
                      component={IconButton}
                      trackType="push"
                      to={`/${URL_PREFIXES[me.role]}/users/${id}/edit`}>
                      <EditIcon color="primary" />
                    </TrackButton>
                  </Tooltip>
                  <Tooltip key={`${id}Delete`} title="Delete" placement="top">
                    <IconButton onClick={() => handleDelete(id)}>
                      <DeleteIcon color="secondary" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination //This pagination is zero-based.
              rowsPerPageOptions={[2, 5, 10, 25]}
              count={data.count}
              rowsPerPage={pagination.page_size}
              page={pagination.page - 1}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    )
  } else {
    return <Spinner />
  }
}

const selector = createStructuredSelector({
  me: meSelector
})

UserTable.propTypes = {
  data: ListDataType,
  role: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
  pagination: PropTypes.object.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired
}

export default compose(withRouter, connect(selector))(UserTable)
