import React from 'react'
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  Tooltip,
  IconButton
} from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { compose } from 'redux'
import PropTypes from 'prop-types'

import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons'
import Spinner from 'components/Spinner'
import { ListDataType } from 'helpers/prop-types'
import { getFullName, getAsianFullName } from 'helpers/utils'
import { URL_PREFIXES } from 'config/constants'
import useStyles from './styles'
import { meSelector } from 'store/modules/auth'
import TrackButton from 'components/TrackButton'

const columns = ['Owner', 'Profile', 'Platform Type', 'Email', 'Password', 'Location', 'URL', 'Actions']

function AccountTable({
  data,
  handleDelete,
  me,
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
          {data.results.map(({ id, profile, account_platform, email, password, location, url }) => (
            <TableRow key={id} hover>
              <TableCell>{getAsianFullName(profile.user)}</TableCell>
              <TableCell>{getFullName(profile)}</TableCell>
              <TableCell>{account_platform?.name}</TableCell>
              <TableCell>{email}</TableCell>
              <TableCell>*****</TableCell>
              <TableCell>{location}</TableCell>
              <TableCell>{url}</TableCell>
              <TableCell className={classes.action}>
                <Tooltip key={`${id}Edit`} title="Edit" placement="top">
                  <TrackButton
                    component={IconButton}
                    trackType="push"
                    to={`/${URL_PREFIXES[me.role]}/accounts/${id}/edit`}>
                    <EditIcon color="primary" />
                  </TrackButton>
                </Tooltip>
                <Tooltip key={`${id}Delete`} title="Delete" placement="top">
                  <IconButton onClick={() => handleDelete(id)}>
                    <DeleteIcon color="secondary" />
                  </IconButton>
                </Tooltip>
              </TableCell>
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

AccountTable.propTypes = {
  data: ListDataType,
  handleDelete: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
}

export default compose(withRouter, connect(selector))(AccountTable)
