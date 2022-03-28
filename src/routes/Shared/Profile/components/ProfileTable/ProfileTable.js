import React from 'react'
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
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import useStyles from './styles'
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons'
import { profile_type_patterns, gender_patterns, URL_PREFIXES } from 'config/constants'
import Spinner from 'components/Spinner'
import TrackButton from 'components/TrackButton'
import { meSelector } from 'store/modules/auth'
import { ListDataType } from 'helpers/prop-types'
import { getAsianFullName } from 'helpers/utils'

const columns = ['Owner', 'Full Name', 'Type', 'Address', 'Country', 'Date of Birth', 'Gender', 'Actions']

function ProfileTable({
  data,
  handleDelete,
  match: { path },
  me,
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
          {data.results.map(({ id, profile_type, first_name, last_name, address, country, dob, gender, user }) => (
            <TableRow key={id} hover>
              <TableCell>{getAsianFullName(user)}</TableCell>
              <TableCell>
                {first_name} {last_name}
              </TableCell>
              <TableCell>
                <Chip
                  label={profile_type_patterns[profile_type].type}
                  classes={{ root: classes[profile_type_patterns[profile_type].color] }}
                />
              </TableCell>
              <TableCell>{address}</TableCell>
              <TableCell>{country}</TableCell>
              <TableCell>{dob}</TableCell>
              <TableCell>{gender_patterns[gender]}</TableCell>
              <TableCell className={classes.action}>
                <Tooltip key={`${id}Edit`} title="Edit" placement="top">
                  <TrackButton
                    component={IconButton}
                    trackType="push"
                    to={`/${URL_PREFIXES[me.role]}/profiles/${id}/edit`}>
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

ProfileTable.propTypes = {
  data: ListDataType,
  handleDelete: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
}

export default compose(withRouter, connect(selector))(ProfileTable)
