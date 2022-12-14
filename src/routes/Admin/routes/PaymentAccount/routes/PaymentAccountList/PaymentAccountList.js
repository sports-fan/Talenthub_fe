import React, { useEffect, useCallback } from 'react'
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
  deletePaymentAccountAndRefresh,
  paymentAccountsSelector,
  paymentAccountsLoadingSelector
} from 'store/modules/paymentAccount'
import { meSelector } from 'store/modules/auth'
import withPaginationInfo from 'hocs/withPaginationInfo'
import { ListDataType } from 'helpers/prop-types'
import { URL_PREFIXES } from 'config/constants'
import TrackButton from 'components/TrackButton'

const PaymentAccountList = ({
  getPaymentAccounts,
  deletePaymentAccountAndRefresh,
  paymentAccounts,
  isPaymentAccountsLoading,
  me,
  location,
  history,
  match: { path },
  show,
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

  const handleDelete = useCallback(
    id => {
      deletePaymentAccountAndRefresh({
        id,
        role: me.role,
        message: 'Are you sure to delete the payment account?'
      })
    },
    [me.role, deletePaymentAccountAndRefresh]
  )

  if (isPaymentAccountsLoading) return <Spinner />
  else
    return (
      <Grid container>
        <Grid item xs={12}>
          <Widget
            title="Payment Accounts"
            disableWidgetMenu
            WidgetButton={
              <TrackButton trackType="push" color="primary" to={`/${URL_PREFIXES[me.role]}/payment-accounts/new`}>
                Add a Payment Account
              </TrackButton>
            }>
            <PaymentAccountTable
              data={paymentAccounts}
              role={me.role}
              onDelete={handleDelete}
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
  deletePaymentAccountAndRefresh,
  show
}

const selectors = createStructuredSelector({
  paymentAccounts: paymentAccountsSelector,
  isPaymentAccountsLoading: paymentAccountsLoadingSelector,
  me: meSelector
})

PaymentAccountList.propTypes = {
  getPaymentAccounts: PropTypes.func.isRequired,
  deletePaymentAccountAndRefresh: PropTypes.func.isRequired,
  paymentAccounts: ListDataType,
  isPaymentAccountsLoading: PropTypes.bool.isRequired,
  me: PropTypes.object,
  match: PropTypes.object.isRequired,
  pagination: PropTypes.object
}

export default compose(withRouter, withPaginationInfo, connect(selectors, actions))(PaymentAccountList)
