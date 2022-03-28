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
import {
  URL_PREFIXES,
  PROJECT_TYPE_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  PROJECT_STATUS,
  PROJECT_TYPE,
  PAYMENT_PERIOD_OPTIONS
} from 'config/constants'
import { meSelector } from 'store/modules/auth'
import { ROLES } from 'config/constants'
import { usersSelector, getUsers } from 'store/modules/user'
import { getClients, clientsSelector } from 'store/modules/client'
import { ListDataType } from 'helpers/prop-types'
import { getAsianFullName, getPriceLabelFromProjectType } from 'helpers/utils'
import TrackButton from 'components/TrackButton'
import useStyles from './styles'

export const validationSchema = Yup.object().shape({
  title: Yup.string().required('This field is required!'),
  weekly_limit: Yup.number().when('type', {
    is: PROJECT_TYPE.HOULRYFT || PROJECT_TYPE.HOURLYPT || PROJECT_TYPE.CONTRACT,
    then: Yup.number().required('This field name is required!'),
    otherwise: Yup.number()
  }),
  price: Yup.number().required('This field is required!'),
  started_at: Yup.date().required('This field is required!'),
  client: Yup.number().required('This field is required!')
})

const validateProjectStarterField = (value, role) =>
  role !== ROLES.DEVELOPER ? (!value ? 'This field is required!' : undefined) : undefined

const validateEndedAtField = (value, project_status, project_type) =>
  project_status === PROJECT_STATUS.ENDED || project_type === PROJECT_TYPE.BUDGET
    ? !value
      ? 'This field is required!'
      : undefined
    : undefined

const ProjectDetailForm = ({
  handleSubmit,
  values,
  location,
  history,
  me: { role },
  me,
  users,
  getUsers,
  match: { params },
  clients,
  getClients
}) => {
  useEffect(() => {
    me.role !== ROLES.DEVELOPER && getUsers(me)
  }, [me, getUsers])

  useEffect(() => {
    getClients()
  }, [getClients])

  const userList = useMemo(() => {
    if (users) {
      return users.results.map(user => ({
        label: getAsianFullName(user),
        value: user.id
      }))
    } else {
      return []
    }
  }, [users])

  const clientList = useMemo(() => {
    if (clients) {
      return clients.results.map(client => ({
        label: client.full_name,
        value: client.id
      }))
    } else {
      return []
    }
  }, [clients])

  const isUpdateMode = useMemo(() => Boolean(params.id), [params.id])
  const classes = useStyles()

  return (
    <form onSubmit={handleSubmit}>
      <Field component={FormInput} type="text" htmlId="title" name="title" label="Title" />
      <Field component={FormSelect} type="text" htmlId="type" name="type" label="Type" options={PROJECT_TYPE_OPTIONS} />
      {values.type !== PROJECT_TYPE.BUDGET && values.type !== PROJECT_TYPE.CONTRACT ? (
        <Field component={FormInput} type="number" htmlId="weekly_limit" name="weekly_limit" label="Weekly Limit" />
      ) : values.type === PROJECT_TYPE.CONTRACT ? (
        <Field
          component={FormSelect}
          htmlId="paymentPeriod"
          name="payment_period"
          label="Payment Period"
          options={PAYMENT_PERIOD_OPTIONS}
        />
      ) : null}
      <Field
        component={FormInput}
        type="number"
        htmlId="price"
        name="price"
        label={getPriceLabelFromProjectType(values.type)}
      />
      <Field
        component={FormInput}
        type="date"
        htmlId="started_at"
        name="started_at"
        label={values.type === PROJECT_TYPE.CONTRACT ? 'Payment Start Date' : 'Started At'}
      />
      {values.status === PROJECT_STATUS.ENDED || values.type === PROJECT_TYPE.BUDGET ? (
        <Field
          component={FormInput}
          type="date"
          htmlId="ended_at"
          name="ended_at"
          label="Ended At"
          validate={value => validateEndedAtField(value, values.status, values.type)}
        />
      ) : null}
      <Field component={FormSelect} htmlId="status" name="status" label="Status" options={PROJECT_STATUS_OPTIONS} />
      <Field
        component={FormEditableSelect}
        htmlId="client"
        name="client"
        label="Client"
        options={clientList}
        placeholder="Select a Client"
      />
      {role !== ROLES.DEVELOPER ? (
        <div>
          <Field
            component={FormEditableSelect}
            htmlId="project_starter"
            name="project_starter"
            label="Project Starter"
            placeholder="Select a Project Stater"
            options={userList}
            validate={value => validateProjectStarterField(value, role)}
          />
        </div>
      ) : null}

      <div className={classes.formButtonWrapper}>
        <Button type="submit" variant="contained" color="primary" className={classes.formButton}>
          {isUpdateMode ? 'Update' : 'Create'}
        </Button>
        <TrackButton
          trackType="pop"
          variant="contained"
          color="secondary"
          to={location.state ? location.state : `${URL_PREFIXES[me.role]}/projects${location.search}`}>
          Go back
        </TrackButton>
      </div>
    </form>
  )
}

ProjectDetailForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  me: PropTypes.object,
  match: PropTypes.object.isRequired,
  users: ListDataType,
  getUsers: PropTypes.func.isRequired,
  clients: ListDataType,
  getClients: PropTypes.func.isRequired
}

const selector = createStructuredSelector({
  me: meSelector,
  users: usersSelector,
  clients: clientsSelector
})

const actions = {
  getUsers,
  getClients
}

export default compose(withRouter, connect(selector, actions))(ProjectDetailForm)
