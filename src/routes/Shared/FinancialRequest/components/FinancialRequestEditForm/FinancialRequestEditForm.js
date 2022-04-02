import React, { useMemo, useEffect } from 'react'
import { Button } from '@material-ui/core'
import { Field } from 'formik'
import { withRouter } from 'react-router'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'

import FormInput from 'components/FormInput'
import FormEditableSelect from 'components/FormEditableSelect'
import FormSelect from 'components/FormSelect'
import { URL_PREFIXES, FINANCIALREQUEST_TYPE_OPTIONS, FINANCIALREQUEST_TYPE } from 'config/constants'
import { meSelector } from 'store/modules/auth'
import { getPaymentAccounts, paymentAccountsSelector } from 'store/modules/paymentAccount'
import { searchProjects, projectsSearchResultsSelector } from 'store/modules/project'
import { ListDataType } from 'helpers/prop-types'
import TrackButton from 'components/TrackButton'
import FormDatePicker from 'components/FormDatePicker'
import useStyles from './styles'

export const validationSchema = Yup.object().shape({
  amount: Yup.number().required('This field is required!'),
  description: Yup.string().required('This field is required!')
})

const validateProjectField = (value, type) =>
  type !== FINANCIALREQUEST_TYPE.SENDPAYMENT ? (!value ? 'This field is required!' : undefined) : undefined

const FinancialRequestDetailForm = ({
  handleSubmit,
  values,
  location,
  history,
  me: { role },
  me,
  match: { params },
  searchProjects,
  projectsSearchResults,
  getPaymentAccounts,
  paymentAccounts
}) => {
  useEffect(() => {
    searchProjects({
      params: {
        project_starter: me.id
      }
    })
    getPaymentAccounts()
  }, [searchProjects, getPaymentAccounts, me])

  const projectList = useMemo(() => {
    if (projectsSearchResults) {
      return projectsSearchResults.map(project => ({
        label: project.title,
        value: project.id
      }))
    } else {
      return []
    }
  }, [projectsSearchResults])

  const isUpdateMode = useMemo(() => Boolean(params.id), [params.id])
  const classes = useStyles()

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
      <Field
        component={FormSelect}
        type="text"
        htmlId="type"
        name="type"
        label="Type"
        options={FINANCIALREQUEST_TYPE_OPTIONS}
      />
      <Field
        component={FormInput}
        type="number"
        htmlId="amount"
        name="amount"
        label="Amount"
        extra={{ placeholder: 'Amount to send or receive' }}
      />
      <Field
        component={FormInput}
        type="text"
        htmlId="address"
        name="address"
        label="Counterparty Address"
        extra={{ placeholder: 'Address to send or receive from. Email or btc address' }}
      />
      {values.type !== FINANCIALREQUEST_TYPE.SENDPAYMENT ? (
        <Field
          component={FormEditableSelect}
          type="text"
          htmlId="project"
          name="project"
          label="Project"
          placeholder="Select a Project"
          options={projectList}
          validate={value => validateProjectField(value, values.type)}
        />
      ) : null}
      <Field
        component={FormSelect}
        type="text"
        htmlId="payment_account"
        name="payment_account"
        label="My Payment Account"
        options={paymentAccountOptions}
      />
      <Field
        component={FormDatePicker}
        variant="outlined"
        inputVariant="outlined"
        name="requested_at"
        label="Requested at"
        className={classes.datapicker}
      />
      <Field
        component={FormInput}
        type="text"
        htmlId="description"
        name="description"
        label="Description"
        extra={{
          multiline: true,
          rows: 5,
          placeholder: 'Payment Platform, Request Details (Details on invoice or payment note) ...'
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
          to={location.state ? location.state : `${URL_PREFIXES[me.role]}/financial-requests${location.search}`}>
          Go back
        </TrackButton>
      </div>
    </form>
  )
}

FinancialRequestDetailForm.propTypes = {
  searchProjects: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  me: PropTypes.object,
  projects: ListDataType,
  values: PropTypes.object.isRequired,
  getPaymentAccounts: PropTypes.func.isRequired,
  paymentAccounts: PropTypes.object
}

const selector = createStructuredSelector({
  me: meSelector,
  projectsSearchResults: projectsSearchResultsSelector,
  paymentAccounts: paymentAccountsSelector
})

const actions = {
  searchProjects,
  getPaymentAccounts
}

export default compose(withRouter, connect(selector, actions))(FinancialRequestDetailForm)
