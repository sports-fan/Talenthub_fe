import React, { useMemo } from 'react'
import { Button } from '@material-ui/core'
import { Field } from 'formik'
import { withRouter } from 'react-router'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import useStyles from './styles'

import FormInput from 'components/FormInput'
import { URL_PREFIXES } from 'config/constants'
import { meSelector } from 'store/modules/auth'
import TrackButton from 'components/TrackButton'

export const validationSchema = Yup.object().shape({
  name: Yup.string().required('This field is required!')
})

const PlatformDetailForm = ({ handleSubmit, values, location, history, me: { role }, me, match: { params } }) => {
  const isUpdateMode = useMemo(() => Boolean(params.id), [params.id])
  const classes = useStyles()
  return (
    <form onSubmit={handleSubmit}>
      <Field component={FormInput} type="text" htmlId="name" name="name" label="Platform name" />

      <div className={classes.formButtonWrapper}>
        <Button type="submit" variant="contained" color="primary" className={classes.formButton}>
          {isUpdateMode ? 'Update' : 'Create'}
        </Button>
        <TrackButton
          trackType="pop"
          variant="contained"
          color="secondary"
          to={location.state ? location.state : `${URL_PREFIXES[me.role]}/platforms${location.search}`}>
          Go back
        </TrackButton>
      </div>
    </form>
  )
}

PlatformDetailForm.propTypes = {
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

export default compose(withRouter, connect(selector))(PlatformDetailForm)
