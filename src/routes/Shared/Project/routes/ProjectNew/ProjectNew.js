import React, { useCallback } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Formik } from 'formik'
import { Grid } from '@material-ui/core'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'

import Widget from 'components/Widget'
import ProjectDetailForm, { validationSchema } from '../../components/ProjectDetailForm'
import { formSubmit } from 'helpers/form'
import { createProject } from 'store/modules/project'
import { meSelector } from 'store/modules/auth'
import { ROLES, PROJECT_STATUS, PROJECT_TYPE, URL_PREFIXES, PAYMENT_PERIODS } from 'config/constants'

const initialValues = {
  title: '',
  type: PROJECT_TYPE.HOURLYFT,
  weekly_limit: '',
  payment_period: PAYMENT_PERIODS.WEEKLY,
  price: '',
  started_at: '',
  ended_at: '',
  status: PROJECT_STATUS.ONGOING,
  client: '',
  project_starter: ''
}

const ProjectNew = ({ createProject, me, history }) => {
  const handleSubmit = useCallback(
    (values, formActions) => {
      return formSubmit(
        createProject,
        {
          data: {
            ...values,
            ended_at:
              values.type === PROJECT_TYPE.BUDGET || values.status === PROJECT_STATUS.ENDED ? values.ended_at : null,
            weekly_limit:
              values.type === PROJECT_TYPE.BUDGET || values.type === PROJECT_TYPE.CONTRACT ? null : values.weekly_limit,
            payment_period: values.type === PROJECT_TYPE.CONTRACT ? values.payment_period : null,
            ...(me.role === ROLES.DEVELOPER
              ? {
                  project_starter: me.id,
                  participants: [me.id]
                }
              : {
                  participants: [values.project_starter]
                })
          },
          success: resData => history.push(`/${URL_PREFIXES[me.role]}/projects/${resData.id}/detail`)
        },
        formActions
      )
    },
    [createProject, me, history]
  )

  return (
    <Grid container>
      <Grid item xs={12}>
        <Widget title="Add a Project" disableWidgetMenu>
          <Formik
            component={ProjectDetailForm}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          />
        </Widget>
      </Grid>
    </Grid>
  )
}

const selector = createStructuredSelector({
  me: meSelector
})

const actions = {
  createProject
}

ProjectNew.propTypes = {
  createProject: PropTypes.func.isRequired,
  me: PropTypes.object
}

export default compose(withRouter, connect(selector, actions))(ProjectNew)
