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
import PropTypes from 'prop-types'

import { URL_PREFIXES } from 'config/constants'
import Spinner from 'components/Spinner'
import { ListDataType } from 'helpers/prop-types'
import { getPlatformLabel } from 'helpers/utils'
import useStyles from './styles'
import { meSelector } from 'store/modules/auth'
import TrackButton from 'components/TrackButton'

function PaymentAccountTable({
  me,
  data,
  role,
  onDelete,
  history,
  location,
  pagination,
  onChangePage,
  onChangeRowsPerPage
}) {
  const classes = useStyles()
  const columns = ['Payment Platform', 'Address', 'Display Name', 'Description']
  // const ref = React.createRef();

  if (data) {
    const { results } = data
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
          {results.map(({ id, platform, address, display_name, description }) => (
            <TableRow key={id} hover>
              <TableCell>{getPlatformLabel(platform)}</TableCell>
              <TableCell>{address}</TableCell>
              <TableCell>{display_name}</TableCell>
              <TableCell>{description}</TableCell>
              <TableCell className={classes.action}>
                <Tooltip key={`${id}Edit`} title="Edit" placement="top">
                  <TrackButton
                    component={IconButton}
                    trackType="push"
                    to={`/${URL_PREFIXES[me.role]}/payment-accounts/${id}/edit`}>
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

export default compose(withRouter, connect(selector))(PaymentAccountTable)

PaymentAccountTable.propTypes = {
  data: ListDataType,
  role: PropTypes.number.isRequired,
  handleDelete: PropTypes.func,
  history: PropTypes.object.isRequired,
  disableActions: PropTypes.bool,
  location: PropTypes.object.isRequired
}
