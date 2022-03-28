import React, { useMemo, useEffect } from 'react'
import { Button } from '@material-ui/core'
import { Field } from 'formik'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'

import FormInput from 'components/FormInput'
import FormEditableSelect from 'components/FormEditableSelect'
import FormSelect from 'components/FormSelect'
import { CLIENT_TYPES, CLIENT_TYPE_OPTIONS, URL_PREFIXES, ROLES } from 'config/constants'
import { meSelector } from 'store/modules/auth'
import { usersSelector, getUsers } from 'store/modules/user'
import { ListDataType } from 'helpers/prop-types'
import { getAsianFullName } from 'helpers/utils'
import TrackButton from 'components/TrackButton'
import useStyles from './styles'

export const validationSchema = Yup.object().shape({
  full_name: Yup.string().required('This field is required!'),
  started_at: Yup.date().required('This field is required!'),
  company_name: Yup.string().when('type', {
    is: CLIENT_TYPES.COMPANY,
    then: Yup.string().required('Company name is required!'),
    otherwise: Yup.string()
  })
})

const validateOwnerField = value => (!value ? 'This field is required!' : undefined)

const ClientDetailForm = ({ handleSubmit, values, location, history, me, match: { params }, users, getUsers }) => {
  useEffect(() => {
    if (me.role !== ROLES.DEVELOPER) {
      getUsers(me)
    }
  }, [getUsers, me])

  const userLists = useMemo(() => {
    if (users) {
      return users.results.map(user => ({
        label: getAsianFullName(user),
        value: user.id
      }))
    } else {
      return []
    }
  }, [users])

  const classes = useStyles()
  const isUpdateMode = Boolean(params.id)
  return (
    <form onSubmit={handleSubmit}>
      <Field component={FormInput} type="text" htmlId="full_name" name="full_name" label="Full Name" />
      <Field component={FormSelect} htmlId="type" name="type" label="Type" options={CLIENT_TYPE_OPTIONS} />
      {values.type === CLIENT_TYPES.COMPANY ? (
        <Field component={FormInput} type="text" htmlId="company_name" name="company_name" label="Company Name" />
      ) : null}
      <Field component={FormInput} type="date" htmlId="started_at" name="started_at" label="Started at" />
      {[ROLES.ADMIN, ROLES.TEAM_MANAGER].includes(me.role) && (
        <Field
          component={FormEditableSelect}
          htmlId="owner"
          type="text"
          name="owner"
          label="Owner"
          placeholder="Select an Owner"
          options={userLists}
          validate={validateOwnerField}
        />
      )}
      <div className={classes.formButtonWrapper}>
        <Button type="submit" variant="contained" color="primary" className={classes.formButton}>
          {isUpdateMode ? 'Update' : 'Create'}
        </Button>
        <TrackButton
          trackType="pop"
          variant="contained"
          color="secondary"
          to={location.state ? location.state : `${URL_PREFIXES[me.role]}/clients${location.search}`}>
          Go back
        </TrackButton>
      </div>
    </form>
  )
}

ClientDetailForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  users: ListDataType,
  getUsers: PropTypes.func.isRequired,
  me: PropTypes.object
}

const selector = createStructuredSelector({
  me: meSelector,
  users: usersSelector
})

const actions = {
  getUsers
}

export default compose(withRouter, connect(selector, actions))(ClientDetailForm)
