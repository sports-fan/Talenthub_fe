import React, { useMemo, useEffect } from 'react'
import { Button } from '@material-ui/core'
import { Field } from 'formik'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as Yup from 'yup'
import { createStructuredSelector } from 'reselect'

import FormInput from 'components/FormInput'
import FormEditableSelect from 'components/FormEditableSelect'
import { URL_PREFIXES } from 'config/constants'
import { getAsianFullName } from 'helpers/utils'
import { meSelector } from 'store/modules/auth'
import { getUsers, usersSelector } from 'store/modules/user'
import { getProjects, projectsSelector } from 'store/modules/project'
import { getPaymentAccounts, paymentAccountsSelector } from 'store/modules/paymentAccount'
import FormDatePicker from 'components/FormDatePicker'
import FormSelect from 'components/FormSelect'
import TrackButton from 'components/TrackButton'
import useStyles from './styles'

export const validationSchema = Yup.object().shape({
  owner: Yup.string().required('This field is required!'),
  address: Yup.string().required('This field is required!'),
  gross_amount: Yup.string().required('This field is required!'),
  net_amount: Yup.string().required('This field is required!'),
  created_at: Yup.string().required('This field is required!'),
  description: Yup.string().required('This field is required!'),
  payment_account: Yup.string().required('This field is required!')
})

const TransactionDetailForm = ({
  handleSubmit,
  location,
  history,
  me,
  match: { params },
  users,
  projects,
  paymentAccounts,
  getUsers,
  getPaymentAccounts,
  getProjects,
  values
}) => {
  useEffect(() => {
    getUsers(me)
    getPaymentAccounts()
  }, [getUsers, getPaymentAccounts, me])

  useEffect(() => {
    getProjects({
      params: {
        project_starter: values.owner
      }
    })
  }, [getProjects, values.owner])

  const userOptions = useMemo(
    () =>
      users
        ? users.results.map(user => ({
            value: user.id,
            label: getAsianFullName(user)
          }))
        : [],
    [users]
  )

  const projectOptions = useMemo(
    () =>
      projects
        ? projects.results.map(project => ({
            value: project.id,
            label: project.title
          }))
        : [],
    [projects]
  )

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

  const isUpdateMode = useMemo(() => Boolean(params.id), [params.id])
  const classes = useStyles()

  return (
    <form onSubmit={handleSubmit}>
      <Field
        component={FormEditableSelect}
        htmlId="owner"
        name="owner"
        label="Owner"
        placeholder="Choose one developer..."
        options={userOptions}
      />
      <Field
        component={FormEditableSelect}
        htmlId="project"
        name="project"
        label="Project"
        placeholder="Choose one project..."
        options={projectOptions}
      />
      <Field component={FormInput} type="text" htmlId="address" name="address" label="From/To" />
      <Field component={FormInput} type="text" htmlId="gross_amount" name="gross_amount" label="Gross amount" />
      <Field component={FormInput} type="text" htmlId="net_amount" name="net_amount" label="Net amount" />
      <Field component={FormDatePicker} name="created_at" label="Date" />
      <Field
        component={FormInput}
        type="text"
        htmlId="description"
        name="description"
        label="Description"
        extra={{
          multiline: true,
          rows: 5,
          placeholder: '...'
        }}
      />
      <Field
        component={FormSelect}
        htmlId="payment_account"
        name="payment_account"
        label="Payment Accounts"
        options={paymentAccountOptions}
      />
      <div className={classes.formButtonWrapper}>
        <Button type="submit" variant="contained" color="primary" className={classes.formButton}>
          {isUpdateMode ? 'Update' : 'Create'}
        </Button>
        <TrackButton
          trackType="pop"
          variant="contained"
          color="secondary"
          to={
            location.state
              ? location.state
              : `${URL_PREFIXES[me.role]}/financial-reports/transactions${location.search}`
          }>
          Go back
        </TrackButton>
      </div>
    </form>
  )
}

TransactionDetailForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  me: PropTypes.object,
  match: PropTypes.object.isRequired,
  users: PropTypes.object,
  paymentAccounts: PropTypes.object,
  getUsers: PropTypes.func.isRequired,
  getPaymentAccounts: PropTypes.func.isRequired
}

const selector = createStructuredSelector({
  me: meSelector,
  users: usersSelector,
  paymentAccounts: paymentAccountsSelector,
  projects: projectsSelector
})

const actions = {
  getUsers,
  getPaymentAccounts,
  getProjects
}
export default compose(withRouter, connect(selector, actions))(TransactionDetailForm)
