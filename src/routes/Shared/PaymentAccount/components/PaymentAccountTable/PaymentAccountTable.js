import React from 'react'
import { withRouter } from 'react-router-dom'
import { Table, TableRow, TableHead, TableBody, TableCell, TableFooter, TablePagination } from '@material-ui/core'
import PropTypes from 'prop-types'

import Spinner from 'components/Spinner'
import { ListDataType } from 'helpers/prop-types'
import { getPlatformLabel } from 'helpers/utils'

function PaymentAccountTable({ data, pagination, onChangePage, onChangeRowsPerPage }) {
  const columns = ['Payment Platform', 'Address', 'Display Name', 'Description']

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
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    )
  } else {
    return <Spinner />
  }
}

export default withRouter(PaymentAccountTable)

PaymentAccountTable.propTypes = {
  data: ListDataType,
  role: PropTypes.number.isRequired,
  handleDelete: PropTypes.func,
  history: PropTypes.object.isRequired,
  disableActions: PropTypes.bool,
  location: PropTypes.object.isRequired
}
