import React from 'react'
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
  Tooltip,
  IconButton
} from '@material-ui/core'
import cn from 'classnames'
import PropTypes from 'prop-types'

import { URL_PREFIXES } from 'config/constants'
import Spinner from 'components/Spinner'
import TrackButton from 'components/TrackButton'
import { ListDataType } from 'helpers/prop-types'
import useStyles from './styles'
import { meSelector } from 'store/modules/auth'

function PlatformTable({ data, role, onDelete, me, history, location, pagination, onChangePage, onChangeRowsPerPage }) {
  const columns = ['Name', 'Actions']
  const classes = useStyles()

  if (data) {
    const { results } = data
    return (
      <Table className="mb-0">
        <TableHead>
          <TableRow>
            {columns.map((key, idx) => (
              <TableCell key={key} className={cn({ [classes.actions]: idx === 1 })}>
                {key}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map(({ id, name }) => (
            <TableRow key={id} hover>
              <TableCell>{name}</TableCell>
              <TableCell className={classes.actions}>
                <Tooltip key={`${id}Edit`} title="Edit" placement="top">
                  <TrackButton
                    component={IconButton}
                    trackType="push"
                    to={`/${URL_PREFIXES[me.role]}/platforms/${id}/edit`}>
                    <EditIcon color="primary" />
                  </TrackButton>
                </Tooltip>
                <Tooltip key={`${id}Delete`} title="Delete" placement="top">
                  <IconButton onClick={() => onDelete(id)}>
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

export default compose(withRouter, connect(selector))(PlatformTable)

PlatformTable.propTypes = {
  data: ListDataType,
  role: PropTypes.number.isRequired,
  handleDelete: PropTypes.func,
  history: PropTypes.object.isRequired,
  disableActions: PropTypes.bool,
  location: PropTypes.object.isRequired
}
