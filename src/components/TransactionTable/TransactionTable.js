import React, { useCallback, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
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
import { show } from 'redux-modal'
import { Edit as EditIcon, Delete as DeleteIcon, Details as DetailsIcon } from '@material-ui/icons'
import PropTypes from 'prop-types'

import Spinner from 'components/Spinner'
import { FormattedDate, FormattedNumber } from 'react-intl'
import { URL_PREFIXES } from 'config/constants'
import useStyles from './styles'
import { getAsianFullName, getProjectName } from 'helpers/utils'
import { ListDataType } from 'helpers/prop-types'
import { getUsers, usersSelector } from 'store/modules/user'
import { getProjects, projectsSelector } from 'store/modules/project'
import { createStructuredSelector } from 'reselect'
import { truncateText } from 'helpers/utils'

function TransactionTable({
  data,
  history,
  me,
  pagination,
  onChangePage,
  onChangeRowsPerPage,
  location,
  onDelete,
  getUsers,
  users,
  getProjects,
  projects,
  show
}) {
  const classes = useStyles()
  const columns = [
    'Date',
    'From/To',
    'Gross Amount',
    'Net Amount',
    'Owner',
    'Project',
    'Payment Account',
    'Description'
  ]
  const role = me?.role

  useEffect(() => {
    getUsers()
    getProjects()
  }, [getUsers, getProjects])

  const showTransactionEdit = useCallback(
    id => () => {
      history.push(`/${URL_PREFIXES[role]}/financial-reports/transactions/${id}/edit`, location.pathname)
    },
    [history, location.pathname, role]
  )

  const showTransactionDetail = useCallback(
    id => () => {
      show('TransactionDetailModal', {
        transactionId: id
      })
    },
    [show]
  )

  const getOnwerFullname = useCallback(
    ownerId => {
      if (users) {
        const user = users.results.filter(userItem => userItem.id === parseInt(ownerId))
        return getAsianFullName(user[0])
      }
    },
    [users]
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
          {data.results.map(
            ({
              id,
              owner,
              address,
              gross_amount: grossAmount,
              net_amount: netAmount,
              created_at: createdAt,
              description,
              project: projectId,
              payment_account: paymentAccount
            }) => (
              <TableRow key={id} hover className={classes.tableRow}>
                <TableCell>
                  <FormattedDate value={createdAt} />
                </TableCell>
                <TableCell>{address}</TableCell>
                <TableCell>
                  <FormattedNumber format="currency" value={grossAmount} />
                </TableCell>
                <TableCell>
                  <FormattedNumber format="currency" value={netAmount} />
                </TableCell>
                <TableCell>{getOnwerFullname(owner)}</TableCell>
                <TableCell>{projects ? getProjectName(projectId)(projects.results) : null}</TableCell>
                <TableCell>{paymentAccount?.display_name || 'None'}</TableCell>
                <TableCell>{description ? truncateText(description) : null}</TableCell>
                <TableCell className={classes.action}>
                  <Tooltip key={`${id}Detail`} title="Detail" placement="top">
                    <IconButton onClick={showTransactionDetail(id)}>
                      <DetailsIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip key={`${id}Edit`} title="Edit" placement="top">
                    <IconButton onClick={showTransactionEdit(id)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip key={`${id}Delete`} title="Delete" placement="top">
                    <IconButton onClick={() => onDelete(id)}>
                      <DeleteIcon color="secondary" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )
          )}
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

const actions = {
  show,
  getUsers,
  getProjects
}

const selector = createStructuredSelector({
  users: usersSelector,
  projects: projectsSelector
})

TransactionTable.propTypes = {
  show: PropTypes.func.isRequired,
  data: ListDataType,
  me: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  users: PropTypes.object,
  getProjects: PropTypes.func.isRequired,
  projects: PropTypes.object
}

export default compose(withRouter, connect(selector, actions))(TransactionTable)
