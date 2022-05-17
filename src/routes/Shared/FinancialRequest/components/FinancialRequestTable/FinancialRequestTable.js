import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  Edit as EditIcon,
  Details as DetailsIcon,
  Cancel as CancelIcon,
  Check as ApproveIcon,
  Close as DeclineIcon
} from '@material-ui/icons'
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
import { FormattedDate, FormattedNumber } from 'react-intl'
import { show } from 'redux-modal'
import PropTypes from 'prop-types'

import useStyles from './styles'
import {
  FINANCIALREQUEST_TYPE_LABELS,
  FINANCIALREQUEST_STATUS_LABELS,
  ROLES,
  FINANCIALREQUEST_STATUS,
  FINANCIALREQUEST_TYPE,
  URL_PREFIXES
} from 'config/constants'
import Spinner from 'components/Spinner'
import TrackButton from 'components/TrackButton'
import { ListDataType } from 'helpers/prop-types'
import { getAsianFullName } from 'helpers/utils'

function FinancialRequestTable({
  data,
  me,
  onCancel,
  onApprove,
  onDecline,
  history,
  location,
  fromDashboard,
  pagination,
  onChangePage,
  onChangeRowsPerPage,
  show
}) {
  const classes = useStyles()
  const columns = ['Date', 'Project', 'Sender', 'To', 'Amount', 'Payment account', 'Type', 'Status', 'Actions']

  const showFinancialRequestDetail = useCallback(
    id => () => {
      show('FinancialRequestDetailModal', {
        financialRequestId: id
      })
    },
    [show]
  )

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
          {results.map(({ id, type, status, amount, address, requested_at, requester, project, payment_account }) => (
            <TableRow key={id} hover>
              <TableCell><FormattedDate value={requested_at} /></TableCell>
              <TableCell>{type !== FINANCIALREQUEST_TYPE.SENDPAYMENT ? project.title : null}</TableCell>
              <TableCell>{getAsianFullName(requester)}</TableCell>
              <TableCell>{address}</TableCell>
              <TableCell>
                <FormattedNumber format="currency" value={amount} />
              </TableCell>
              <TableCell>{payment_account?.display_name || 'None'}</TableCell>
              <TableCell>{FINANCIALREQUEST_TYPE_LABELS[type]}</TableCell>
              <TableCell>{FINANCIALREQUEST_STATUS_LABELS[status]}</TableCell>
              <TableCell className={classes.action}>
                <Tooltip key={`${id}Detail`} title="Detail" placement="top">
                  <IconButton onClick={showFinancialRequestDetail(id)}>
                    <DetailsIcon color="primary" />
                  </IconButton>
                </Tooltip>
                {ROLES.ADMIN !== me.role && requester.id === me.id ? (
                  <>
                    {status === FINANCIALREQUEST_STATUS.PENDING ? (
                      <Tooltip key={`${id}Edit`} title="Edit" placement="top">
                        <TrackButton
                          component={IconButton}
                          trackType="push"
                          to={`/${URL_PREFIXES[me.role]}/financial-requests/${id}/edit`}>
                          <EditIcon color="primary" />
                        </TrackButton>
                      </Tooltip>
                    ) : null}
                    {[FINANCIALREQUEST_STATUS.PENDING, FINANCIALREQUEST_STATUS.DECLINED].includes(status) && (
                      <Tooltip key={`${id}Cancel`} title="Cancel" placement="top">
                        <IconButton onClick={() => onCancel(id)}>
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                ) : null}
                {ROLES.ADMIN === me.role ? (
                  <>
                    {status === FINANCIALREQUEST_STATUS.PENDING ? (
                      <>
                        <Tooltip key={`${id}Approve`} title="Approve" placement="top">
                          <IconButton onClick={() => onApprove(id, amount, type, payment_account.id)}>
                            <ApproveIcon className={classes.success} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip key={`${id}Decline`} title="Decline" placement="top">
                          <IconButton onClick={() => onDecline(id)}>
                            <DeclineIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : null}
                  </>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {!fromDashboard && (
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
        )}
      </Table>
    )
  } else {
    return <Spinner />
  }
}

const actions = {
  show
}
export default compose(withRouter, connect(null, actions))(FinancialRequestTable)

FinancialRequestTable.propTypes = {
  show: PropTypes.func.isRequired,
  data: ListDataType,
  me: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  onApprove: PropTypes.func,
  onCancel: PropTypes.func,
  onDecline: PropTypes.func
}

FinancialRequestTable.defaultProps = {
  fromDashboard: false
}
