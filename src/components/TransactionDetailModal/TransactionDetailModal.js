import React, { useEffect, useCallback } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@material-ui/core'
import { createStructuredSelector } from 'reselect'
import { connectModal } from 'redux-modal'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { FormattedNumber, FormattedTime, FormattedDate } from 'react-intl'

import useStyles from './styles'
import Spinner from 'components/Spinner'
import {
  getTransactionDetail,
  transactionDetailLoadingSelector,
  transactionDetailSelector
} from 'store/modules/transaction'
import { getUsers, usersSelector } from 'store/modules/user'
import { meSelector } from 'store/modules/auth'
import LabelValue from 'components/LabelValue'
import { FINANCIALREQUEST_TYPE_LABELS, FINANCIALREQUEST_TYPE } from 'config/constants'
import { truncateText, getAsianFullName } from 'helpers/utils'
import { URL_PREFIXES } from 'config/constants'

const TransactionDetailModal = ({
  getUsers,
  users,
  getTransactionDetail,
  transactionDetail,
  isTransactionDetailLoading,
  transactionId,
  show,
  handleHide,
  me
}) => {
  const classes = useStyles()
  const role = me?.role
  const fr = transactionDetail?.financial_request || undefined

  useEffect(() => {
    getTransactionDetail(transactionId)
    getUsers()
  }, [getTransactionDetail, getUsers, transactionId])

  const getOnwerFullname = useCallback(
    ownerId => {
      if (users) {
        const user = users.results.filter(userItem => userItem.id === parseInt(ownerId))
        return getAsianFullName(user[0])
      }
    },
    [users]
  )

  return (
    transactionDetail && (
      <Dialog open={show} onClose={handleHide} fullWidth maxWidth="md">
        <DialogTitle id="form-dialog-title">Transaction Detail</DialogTitle>
        <DialogContent className={classes.paper}>
          {isTransactionDetailLoading ? (
            <Spinner />
          ) : (
            <Grid container>
              <Grid item sm={6}>
                <LabelValue label="Date">
                  <FormattedDate value={transactionDetail.created_at} format="dayMonthAndYear" />{' '}
                  <FormattedTime value={transactionDetail.created_at} />
                </LabelValue>
                <LabelValue label="Requested by">{getOnwerFullname(transactionDetail.owner)}</LabelValue>
                <LabelValue label="From/To">{transactionDetail.address}</LabelValue>
                <LabelValue label="Gross Amount">
                  <FormattedNumber format="currency" value={transactionDetail.gross_amount} />
                </LabelValue>
                <LabelValue label="Net Amount">
                  <FormattedNumber format="currency" value={transactionDetail.net_amount} />
                </LabelValue>
                <LabelValue label="Payment Account">
                  {`${transactionDetail.payment_account.display_name || 'None'} (${truncateText(
                    transactionDetail.payment_account.address
                  )}) - ${transactionDetail.payment_account.platform}`}
                </LabelValue>
              </Grid>
              <Grid item sm={6}>
                {fr ? (
                  <>
                    <LabelValue label="Financial Request Type">{FINANCIALREQUEST_TYPE_LABELS[fr.type]}</LabelValue>
                    <LabelValue label="Requested Amount">
                      <FormattedNumber format="currency" value={fr.amount} />
                    </LabelValue>
                    <LabelValue label={fr.type === FINANCIALREQUEST_TYPE.SENDPAYMENT ? 'Pay To' : 'Receive From'}>
                      {fr.address}
                    </LabelValue>
                    {fr.type !== FINANCIALREQUEST_TYPE.SENDPAYMENT && (
                      <LabelValue label="Associated Project">{fr.project.title}</LabelValue>
                    )}
                  </>
                ) : null}
              </Grid>
              <Grid item sm={12}>
                <LabelValue label="Description">{transactionDetail.description}</LabelValue>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            component="a"
            href={`/${URL_PREFIXES[role]}/financial-reports/transactions/${transactionDetail.id}/detail`}
            target="_blank"
            color="primary">
            View Detail Page
          </Button>
          <Button onClick={handleHide} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  )
}

const actions = {
  getTransactionDetail,
  getUsers
}

const selector = createStructuredSelector({
  transactionDetail: transactionDetailSelector,
  isTransactionDetailLoading: transactionDetailLoadingSelector,
  me: meSelector,
  users: usersSelector
})

TransactionDetailModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  getTransactionDetail: PropTypes.func.isRequired,
  transactionDetail: PropTypes.object,
  isTransactionDetailLoading: PropTypes.bool.isRequired,
  me: PropTypes.object.isRequired
}

export default compose(
  connectModal({ name: 'TransactionDetailModal', destroyOnHide: false }),
  connect(selector, actions)
)(TransactionDetailModal)
