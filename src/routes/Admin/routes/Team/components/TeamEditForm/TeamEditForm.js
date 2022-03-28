import React, { useMemo } from 'react'
import { Button } from '@material-ui/core'
import { Field } from 'formik'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import * as Yup from 'yup'

import FormInput from 'components/FormInput'
import TrackButton from 'components/TrackButton'
import useStyles from './styles'

export const validationSchema = Yup.object().shape({
  name: Yup.string().required('This field is required!')
})

const TeamEditForm = ({ location, history, handleSubmit, match: { params } }) => {
  const isEdit = useMemo(() => params.id, [params])
  const classes = useStyles()
  return (
    <form onSubmit={handleSubmit}>
      <Field component={FormInput} htmlId="name" type="text" name="name" label="Team Name" />
      <div className={classes.formButtonWrapper}>
        <Button type="submit" variant="contained" color="primary" className={classes.formButton}>
          {isEdit ? 'Update' : 'Create'}
        </Button>
        <TrackButton
          trackType="pop"
          variant="contained"
          color="secondary"
          to={location.state ? location.state : `/admin/teams${location.search}`}>
          Go back
        </TrackButton>
      </div>
    </form>
  )
}

TeamEditForm.propTypes = {
  params: PropTypes.object,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default withRouter(TeamEditForm)
