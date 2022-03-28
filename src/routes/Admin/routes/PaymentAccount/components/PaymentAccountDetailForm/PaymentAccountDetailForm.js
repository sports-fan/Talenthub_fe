import React, { useMemo } from 'react'
import Button from '@material-ui/core/Button'
import { Field } from 'formik'
import { withRouter } from 'react-router'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import useStyles from './styles'
import { createStructuredSelector } from 'reselect'

import FormInput from 'components/FormInput'
import FormEditableSelect from 'components/FormEditableSelect'
import { URL_PREFIXES, PAYMENT_PLATFORM_OPTIONS } from 'config/constants'
import { meSelector } from 'store/modules/auth'
import TrackButton from 'components/TrackButton'

export const validationSchema = Yup.object().shape({
  platform: Yup.string().required('This field is required!'),
  address: Yup.string().required('This field is required!'),
  display_name: Yup.string().required('This field is required!')
})

const PaymentAccountDetailForm = ({ handleSubmit, values, location, history, me: { role }, me, match: { params } }) => {
  const isUpdateMode = useMemo(() => Boolean(params.id), [params.id])
  const classes = useStyles()
  return (
    <form onSubmit={handleSubmit}>
      <Field
        component={FormEditableSelect}
        htmlId="platform"
        name="platform"
        label="Payment Platform"
        placeholder="Choose one platform..."
        options={PAYMENT_PLATFORM_OPTIONS}
      />
      <Field component={FormInput} type="text" htmlId="address" name="address" label="Address" />
      <Field component={FormInput} type="text" htmlId="displayName" name="display_name" label="Display Name" />
      <Field
        component={FormInput}
        type="text"
        htmlId="description"
        name="description"
        label="Description"
        extra={{
          multiline: true,
          rows: 5,
          placeholder: 'Extra Information'
        }}
      />
      <div className={classes.formButtonWrapper}>
        <Button type="submit" variant="contained" color="primary" className={classes.formButton}>
          {isUpdateMode ? 'Update' : 'Create'}
        </Button>
        <TrackButton
          trackType="pop"
          variant="contained"
          color="secondary"
          to={location.state ? location.state : `${URL_PREFIXES[me.role]}/payment-accounts${location.search}`}>
          Go back
        </TrackButton>
      </div>
    </form>
  )
}

PaymentAccountDetailForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  me: PropTypes.object,
  match: PropTypes.object.isRequired
}

const selector = createStructuredSelector({
  me: meSelector
})

export default compose(withRouter, connect(selector, null))(PaymentAccountDetailForm)
