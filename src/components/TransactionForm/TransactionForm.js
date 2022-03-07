import React, { useEffect, useMemo } from 'react'
import { Field } from 'formik'
import { Button } from '@material-ui/core'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'

import FormInput from 'components/FormInput'
import FormEditableSelect from 'components/FormEditableSelect'
import useStyles from './styles'
import { FINANCIALREQUEST_TYPE } from 'config/constants'
import { getPaymentAccounts, paymentAccountsSelector } from 'store/modules/paymentAccount'

const TransactionForm = ({ handleSubmit, onClose, requestType, getPaymentAccounts, paymentAccounts }) => {
  const classes = useStyles()

  useEffect(() => {
    getPaymentAccounts()
  }, [getPaymentAccounts])

  const paymentAccountOptions = useMemo(
    () =>
      paymentAccounts
        ? paymentAccounts.results.map(paymentAccount => ({
            value: paymentAccount.id,
            label: `${paymentAccount.display_name} (${paymentAccount.address}) - ${paymentAccount.platform}`
          }))
        : [],
    [paymentAccounts]
  )

  return (
    <form onSubmit={handleSubmit}>
      {requestType !== FINANCIALREQUEST_TYPE.SENDPAYMENT ? (
        <>
          <Field component={FormInput} htmlId="gross_amount" type="number" name="gross_amount" label="Gross Amount" />
          <Field component={FormInput} htmlId="net_amount" type="number" name="net_amount" label="Net Amount" />
        </>
      ) : (
        <>
          <Field component={FormInput} htmlId="net_amount" type="number" name="net_amount" label="Gross Amount" />
          <Field component={FormInput} htmlId="gross_amount" type="number" name="gross_amount" label="Net Amount" />
        </>
      )}
      <Field component={FormInput} type="date" htmlId="created_at" name="created_at" label="Date" />
      <Field
        component={FormEditableSelect}
        htmlId="payment_account"
        type="text"
        name="payment_account"
        label="Payment Account"
        placeholder="Select One"
        options={paymentAccountOptions}
      />
      <div className={classes.formButtonWrapper}>
        <Button type="submit" variant="contained" color="primary" className={classes.formButton}>
          Approve
        </Button>
        <Button variant="contained" color="secondary" className={classes.formButton} onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

const actions = {
  getPaymentAccounts
}

const selectors = createStructuredSelector({
  paymentAccounts: paymentAccountsSelector
})

TransactionForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  requestType: PropTypes.number.isRequired
}

export default connect(selectors, actions)(TransactionForm)
