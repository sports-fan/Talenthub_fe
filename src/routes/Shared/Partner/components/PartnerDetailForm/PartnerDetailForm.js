import React, { useMemo, useEffect } from 'react'
import { Button, FormLabel, Grid } from '@material-ui/core'
import { Field, FieldArray } from 'formik'
import { withRouter } from 'react-router'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'

import FormInput from 'components/FormInput'
import FormEditableSelect from 'components/FormEditableSelect'
import FormSelect from 'components/FormSelect'
import useStyles from './styles'
import { CONTACT_METHOD_TYPES, URL_PREFIXES } from 'config/constants'
import { meSelector } from 'store/modules/auth'
import { ROLES } from 'config/constants'
import { usersSelector, getUsers } from 'store/modules/user'
import { ListDataType } from 'helpers/prop-types'
import { getAsianFullName } from 'helpers/utils'
import TrackButton from 'components/TrackButton'

export const validationSchema = Yup.object().shape({
  full_name: Yup.string().required('This field is required!'),
  email: Yup.string().required('This field is required!')
  // address: Yup.string().required('This field is required!'),
  // dob: Yup.string().required('This field is required!'),
  // phone_num: Yup.string().required('This field is required!')
})

const validateOwnerField = value => (!value ? 'This field is required!' : undefined)
const validateContactMethodField = value => (value ? undefined : 'This field is required!')

const PartnerDetailForm = ({
  handleSubmit,
  values,
  initialValues,
  location,
  history,
  me: { role },
  me,
  users,
  getUsers,
  match: { params }
}) => {
  const classes = useStyles()

  useEffect(() => {
    if (me.role !== ROLES.DEVELOPER) {
      getUsers(me)
    }
  }, [getUsers, me])

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

  const isUpdateMode = Boolean(params.id)
  return (
    <form onSubmit={handleSubmit}>
      <Field component={FormInput} type="text" htmlId="full_name" name="full_name" label="Full Name" />
      <Field component={FormInput} type="email" htmlId="email" name="email" label="Email" />
      <Field component={FormInput} type="text" htmlId="address" name="address" label="Address" />
      <Field component={FormInput} type="date" htmlId="dob" name="dob" label="Data Of Birth" />
      <Field component={FormInput} type="text" htmlId="phone_num" name="phone_num" label="Phone Number" />
      {[ROLES.ADMIN, ROLES.TEAM_MANAGER].includes(me.role) && (
        <Field
          component={FormEditableSelect}
          htmlId="owner"
          type="text"
          name="owner"
          label="Owner"
          options={userList}
          placeholder="Select an Owner"
          validate={validateOwnerField}
        />
      )}
      <FieldArray name="contact_method">
        {arrayHelpers => {
          return (
            <div>
              <Grid container className={classes.contactMethodTitle}>
                <Grid item md={11}>
                  <FormLabel>Contact Method</FormLabel>
                </Grid>
                <Grid item md={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.contactMethodAdd}
                    onClick={() => {
                      arrayHelpers.push({ type: '', id: '' })
                    }}>
                    Add
                  </Button>
                </Grid>
              </Grid>
              {values.contact_method?.length > 0 &&
                values.contact_method.map((item, index) => (
                  <Grid container spacing={1} className={classes.contactMethodRow} key={index}>
                    <Grid item md={3}>
                      <Field
                        noMb
                        component={FormSelect}
                        htmlId={`contact_method.${index}.type`}
                        name={`contact_method.${index}.type`}
                        validate={validateContactMethodField}
                        options={CONTACT_METHOD_TYPES}
                      />
                    </Grid>
                    <Grid item md={7}>
                      <Field
                        noMb
                        component={FormInput}
                        type="text"
                        htmlId={`contact_method.${index}.id`}
                        name={`contact_method.${index}.id`}
                        validate={validateContactMethodField}
                      />
                    </Grid>
                    <Grid item md={2}>
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.contactMethodRemove}
                        onClick={() => {
                          arrayHelpers.remove(index)
                        }}>
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                ))}
            </div>
          )
        }}
      </FieldArray>
      <div className={classes.formButtonWrapper}>
        <Button type="submit" variant="contained" color="primary" className={classes.formButton}>
          {isUpdateMode ? 'Update' : 'Create'}
        </Button>
        <TrackButton
          trackType="pop"
          variant="contained"
          color="secondary"
          to={location.state ? location.state : `${URL_PREFIXES[me.role]}/partners${location.search}`}>
          Go back
        </TrackButton>
      </div>
    </form>
  )
}

PartnerDetailForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  me: PropTypes.object,
  users: ListDataType,
  getUsers: PropTypes.func.isRequired,
  match: PropTypes.object
}

const selector = createStructuredSelector({
  me: meSelector,
  users: usersSelector
})

const actions = {
  getUsers
}

export default compose(withRouter, connect(selector, actions))(PartnerDetailForm)
