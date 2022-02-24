import React, { useEffect } from 'react'
import { Grid } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { show } from 'redux-modal'

import Widget from 'components/Widget'
import PaymentAccountTable from '../../components/PaymentAccountTable'
import Spinner from 'components/Spinner'
import {
  getPaymentAccounts,
  paymentAccountsSelector,
  paymentAccountsLoadingSelector
} from 'store/modules/paymentAccount'
import { meSelector } from 'store/modules/auth'
import withPaginationInfo from 'hocs/withPaginationInfo'
import { ListDataType } from 'helpers/prop-types'

const PaymentAccountList = ({
  getPaymentAccounts,
  paymentAccounts,
  isPaymentAccountsLoading,
  me,
  pagination,
  onChangePage,
  onChangeRowsPerPage
}) => {
  useEffect(() => {
    getPaymentAccounts({
      me: me,
      params: pagination
    })
  }, [getPaymentAccounts, me, pagination])

  if (isPaymentAccountsLoading) return <Spinner />
  else
    return (
      <Grid container>
        <Grid item xs={12}>
          <Widget title="Payment Accounts" disableWidgetMenu>
            <PaymentAccountTable
              data={paymentAccounts}
              role={me.role}
              pagination={pagination}
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          </Widget>
        </Grid>
      </Grid>
    )
}

const actions = {
  getPaymentAccounts,
  show
}

const selectors = createStructuredSelector({
  paymentAccounts: paymentAccountsSelector,
  isPaymentAccountsLoading: paymentAccountsLoadingSelector,
  me: meSelector
})

PaymentAccountList.propTypes = {
  getPaymentAccounts: PropTypes.func.isRequired,
  paymentAccounts: ListDataType,
  isPaymentAccountsLoading: PropTypes.bool.isRequired,
  me: PropTypes.object,
  match: PropTypes.object.isRequired,
  pagination: PropTypes.object
}

export default compose(withRouter, withPaginationInfo, connect(selectors, actions))(PaymentAccountList)
