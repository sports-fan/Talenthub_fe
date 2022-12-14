import React, { useEffect, useMemo } from 'react'
import { Button } from '@material-ui/core'
import { Field } from 'formik'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'

import FormInput from 'components/FormInput'
import FormEditableSelect from 'components/FormEditableSelect'
import FormPasswordInput from 'components/FormPasswordInput'
import TrackButton from 'components/TrackButton'
import { getProfiles, profileSelector } from 'store/modules/profile'
import { getPlatforms, platformsSelector } from 'store/modules/platform'
import { meSelector } from 'store/modules/auth'
import { URL_PREFIXES } from 'config/constants'
import { ListDataType } from 'helpers/prop-types'
import { getFullName } from 'helpers/utils'
import useStyles from './styles'

export const validationSchema = Yup.object().shape({
  profile: Yup.string().required('This field is required!'),
  account_platform: Yup.string().required('This field is required!'),
  email: Yup.string().required('This field is required!'),
  password: Yup.string().required('This field is required!'),
  location: Yup.string().required('This field is required!'),
  url: Yup.string().required('This field is required!')
})

const AccountDetailForm = ({
  getProfiles,
  getPlatforms,
  profiles,
  platforms,
  location,
  history,
  handleSubmit,
  me,
  match: { params }
}) => {
  useEffect(() => {
    getProfiles()
  }, [getProfiles])

  useEffect(() => {
    getPlatforms()
  }, [getPlatforms])

  const isUpdateMode = Boolean(params.id)
  const classes = useStyles()

  const profileOptions = useMemo(
    () =>
      profiles
        ? profiles.results.map(profile => ({
            value: profile.id,
            label: getFullName(profile)
          }))
        : [],
    [profiles]
  )

  const platformOptions = useMemo(
    () =>
      platforms
        ? platforms.results.map(platform => ({
            value: platform.id,
            label: platform.name
          }))
        : [],
    [platforms]
  )

  return (
    <form onSubmit={handleSubmit}>
      <Field
        component={FormEditableSelect}
        htmlId="profile"
        type="text"
        name="profile"
        label="Profile"
        placeholder="Select a Profile"
        options={profileOptions}
      />
      <Field
        component={FormEditableSelect}
        htmlId="account_platform"
        type="text"
        name="account_platform"
        label="Platform Type"
        placeholder="Select a Platform"
        options={platformOptions}
      />
      <Field component={FormInput} htmlId="email" type="email" name="email" label="Email" />
      <Field component={FormPasswordInput} htmlId="password" name="password" label="Password" />
      <Field component={FormInput} htmlId="location" type="text" name="location" label="Location" />
      <Field component={FormInput} htmlId="url" type="text" name="url" label="URL" />
      <Field
        component={FormInput}
        htmlId="extra_info"
        type="text"
        name="extra_info"
        label="Extra Information"
        extra={{
          multiline: true,
          rows: 5,
          placeholder: 'Security Q/A, Recovery Email, Recovery Phone Number ...'
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
          to={location.state ? location.state : `${URL_PREFIXES[me.role]}/accounts${location.search}`}>
          Go back
        </TrackButton>
      </div>
    </form>
  )
}

AccountDetailForm.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  getProfiles: PropTypes.func.isRequired,
  profiles: ListDataType,
  me: PropTypes.object,
  match: PropTypes.object.isRequired
}

const actions = {
  getProfiles,
  getPlatforms
}

const selector = createStructuredSelector({
  profiles: profileSelector,
  platforms: platformsSelector,
  me: meSelector
})

export default compose(withRouter, connect(selector, actions))(AccountDetailForm)
