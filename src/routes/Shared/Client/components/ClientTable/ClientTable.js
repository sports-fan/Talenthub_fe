import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
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
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import Spinner from 'components/Spinner'
import TrackButton from 'components/TrackButton'
import { CLIENT_TYPE_LABELS, CLIENT_TYPES, URL_PREFIXES } from 'config/constants'
import { ROLES } from 'config/constants'
import { ListDataType } from 'helpers/prop-types'
import { getAsianFullName } from 'helpers/utils'
import useStyles from './styles'
import { meSelector } from 'store/modules/auth'

function ClientTable({
  data,
  role,
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
  const columns = useMemo(
    () =>
      role === ROLES.DEVELOPER
        ? ['Full Name', 'Type', 'Company Name', 'Started at', 'Actions']
        : ['Full Name', 'Type', 'Company Name', 'Started at', 'Owner', 'Actions'],
    [role]
  )

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
          {data.results.map(({ id, full_name, type, company_name, owner, started_at }) => (
            <TableRow key={id} hover>
              <TableCell>{full_name}</TableCell>
              <TableCell>{CLIENT_TYPE_LABELS[type]}</TableCell>
              <TableCell>{type === CLIENT_TYPES.INDIVIDUAL ? null : company_name}</TableCell>
              <TableCell>{started_at}</TableCell>
              {role === ROLES.DEVELOPER ? null : <TableCell>{getAsianFullName(owner)}</TableCell>}
              <TableCell className={classes.action}>
                <Tooltip key={`${id}Edit`} title="Edit" placement="top">
                  <TrackButton
                    component={IconButton}
                    trackType="push"
                    to={`/${URL_PREFIXES[me.role]}/clients/${id}/edit`}>
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

ClientTable.propTypes = {
  data: ListDataType,
  role: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
}

export default compose(withRouter, connect(selector))(ClientTable)
