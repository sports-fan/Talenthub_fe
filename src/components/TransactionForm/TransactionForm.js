import React from 'react'
import { Field } from 'formik'
import { Button } from '@material-ui/core'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'

import FormInput from 'components/FormInput'
import FormSelect from 'components/FormSelect'
import useStyles from './styles'
import { PAYMENT_PLATFORM_OPTIONS } from 'config/constants'

const TransactionForm = ({ handleSubmit, onClose }) => {
  const classes = useStyles()

  return (
    <form onSubmit={handleSubmit}>
      <Field component={FormInput} htmlId="gross_amount" type="number" name="gross_amount" label="Gross Amount" />
      <Field component={FormInput} htmlId="net_amount" type="number" name="net_amount" label="Net Amount" />
      <Field
        component={FormSelect}
        htmlId="payment_platform"
        type="text"
        name="payment_platform"
        label="Payment Platform"
        options={PAYMENT_PLATFORM_OPTIONS}
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

const actions = {}

const selectors = createStructuredSelector({})

TransactionForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default connect(
  selectors,
  actions
)(TransactionForm)