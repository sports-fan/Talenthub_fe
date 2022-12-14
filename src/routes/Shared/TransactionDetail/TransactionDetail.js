import React, { useEffect, useCallback } from 'react'
import { Button, Grid } from '@material-ui/core'
import { Link, withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { show } from 'redux-modal'
import { FormattedNumber, FormattedTime, FormattedDate } from 'react-intl'

import Widget from 'components/Widget'
import Spinner from 'components/Spinner'
import {
  getTransactionDetail,
  transactionDetailLoadingSelector,
  transactionDetailSelector
} from 'store/modules/transaction'
import { getUsers, usersSelector } from 'store/modules/user'
import { meSelector } from 'store/modules/auth'
import { getAsianFullName } from 'helpers/utils'
import { URL_PREFIXES, ROLES } from 'config/constants'
import LabelValue from 'components/LabelValue'
import { FINANCIALREQUEST_TYPE_LABELS, FINANCIALREQUEST_TYPE } from 'config/constants'

const TransactionDetail = ({
  getUsers,
  users,
  getTransactionDetail,
  transactionDetail,
  isTransactionDetailLoading,
  match: { params },
  me
}) => {
  useEffect(() => {
    getTransactionDetail(params.id)
    getUsers()
  }, [getTransactionDetail, getUsers, params])

  const getOnwerFullname = useCallback(
    ownerId => {
      if (users) {
        const user = users.results.filter(userItem => userItem.id === parseInt(ownerId))
        return getAsianFullName(user[0])
      }
    },
    [users]
  )

  const fr = transactionDetail?.financial_request || undefined
  const role = me?.role

  if (isTransactionDetailLoading) return <Spinner />
  else
    return (
      transactionDetail && (
        <>
          <Grid container>
            <Grid item xs={12}>
              <Widget
                title="Transaction Detail"
                disableWidgetMenu
                WidgetButton={
                  <Button color="primary" component={Link} to={`/${URL_PREFIXES[role]}/financial-reports/transactions`}>
                    Back to list
                  </Button>
                }>
                <Grid container>
                  <Grid item sm={6}>
                    <LabelValue label="Date">
                      <FormattedDate value={transactionDetail.created_at} format="dayMonthAndYear" />{' '}
                      <FormattedTime value={transactionDetail.created_at} />
                    </LabelValue>
                    <LabelValue label="Requested by">
                      {role === ROLES.DEVELOPER ? (
                        getOnwerFullname(transactionDetail.owner)
                      ) : (
                        <Link to={`/${URL_PREFIXES[role]}/users/${transactionDetail.owner}/detail`}>
                          {getOnwerFullname(transactionDetail.owner)}
                        </Link>
                      )}
                    </LabelValue>
                    <LabelValue label="From/To">{transactionDetail.address}</LabelValue>
                    <LabelValue label="Gross Amount">
                      <FormattedNumber format="currency" value={transactionDetail.gross_amount} />
                    </LabelValue>
                    <LabelValue label="Net Amount">
                      <FormattedNumber format="currency" value={transactionDetail.net_amount} />
                    </LabelValue>
                    <LabelValue label="Payment Account">
                      {`${transactionDetail.payment_account.display_name || 'None'} (${
                        transactionDetail.payment_account.address
                      }) - ${transactionDetail.payment_account.platform}`}
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
                          <LabelValue label="Associated Project">
                            <Link to={`/${URL_PREFIXES[role]}/projects/${fr.project.id}/detail`}>
                              {fr.project.title}
                            </Link>
                          </LabelValue>
                        )}
                      </>
                    ) : null}
                  </Grid>
                  <Grid item sm={12}>
                    <LabelValue label="Description">{transactionDetail.description}</LabelValue>
                  </Grid>
                </Grid>
              </Widget>
            </Grid>
          </Grid>
        </>
      )
    )
}

const actions = {
  getTransactionDetail,
  getUsers,
  show
}

const selector = createStructuredSelector({
  transactionDetail: transactionDetailSelector,
  isTransactionDetailLoading: transactionDetailLoadingSelector,
  me: meSelector,
  users: usersSelector
})

TransactionDetail.propTypes = {
  getTransactionDetail: PropTypes.func.isRequired,
  transactionDetail: PropTypes.object,
  isTransactionDetailLoading: PropTypes.bool.isRequired,
  me: PropTypes.object.isRequired,
  show: PropTypes.func.isRequired
}

export default compose(withRouter, connect(selector, actions))(TransactionDetail)
