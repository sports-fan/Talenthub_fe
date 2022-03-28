import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  IconButton,
  Tooltip,
  Chip
} from '@material-ui/core'
import PropTypes from 'prop-types'

import { ROLES, URL_PREFIXES } from 'config/constants'
import Spinner from 'components/Spinner'
import TrackButton from 'components/TrackButton'
import { ListDataType } from 'helpers/prop-types'
import { getAsianFullName } from 'helpers/utils'
import useStyles from './styles'
import { meSelector } from 'store/modules/auth'

function PartnerTable({
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
        ? ['Full Name', 'Email', 'Address', 'Date of Birth', 'Phone Number', 'Contact Method', 'Actions']
        : ['Full Name', 'Email', 'Address', 'Date of Birth', 'Phone Number', 'Contact Method', 'Owner', 'Actions'],
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
          {data.results.map(({ id, full_name, email, address, dob, phone_num, contact_method, owner }) => (
            <TableRow key={id} hover>
              <TableCell>{full_name}</TableCell>
              <TableCell>{email}</TableCell>
              <TableCell>{address}</TableCell>
              <TableCell>{dob}</TableCell>
              <TableCell>{phone_num}</TableCell>
              <TableCell>
                {(contact_method || []).map(method => (
                  <Tooltip key={method.id} title={method.id} placement="top">
                    <Chip label={method.type} variant="outlined" />
                  </Tooltip>
                ))}
              </TableCell>
              {role === ROLES.DEVELOPER ? null : <TableCell>{getAsianFullName(owner)}</TableCell>}
              <TableCell className={classes.action}>
                <Tooltip key={`${id}Edit`} title="Edit" placement="top">
                  <TrackButton
                    component={IconButton}
                    trackType="push"
                    to={`/${URL_PREFIXES[me.role]}/partners/${id}/edit`}>
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

PartnerTable.propTypes = {
  data: ListDataType,
  role: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
}

export default compose(withRouter, connect(selector))(PartnerTable)
