import React, { useEffect, useCallback, useMemo } from 'react'
import { Grid } from '@material-ui/core'
import { Formik } from 'formik'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'
import PropTypes from 'prop-types'

import Widget from 'components/Widget'
import { formSubmit } from 'helpers/form'
import FinancialRequestEditForm, { validationSchema } from '../../components/FinancialRequestEditForm'
import {
  getFinancialRequestDetail,
  updateFinancialRequestDetail,
  financialRequestDetailSelector,
  financialRequestDetailLoadingSelector
} from 'store/modules/financialRequest'
import Spinner from 'components/Spinner'
import { meSelector } from 'store/modules/auth'
import { ROLES, URL_PREFIXES } from 'config/constants'
import { serializeFinancialRequest } from 'helpers/utils'

const FinancialRequestEdit = ({
  getFinancialRequestDetail,
  updateFinancialRequestDetail,
  financialRequestDetail,
  isDetailLoading,
  match: { params },
  me,
  history
}) => {
  useEffect(() => {
    getFinancialRequestDetail(params.id)
  }, [getFinancialRequestDetail, params])

  const initialValues = useMemo(
    () => ({
      type: financialRequestDetail?.type || '',
      amount: financialRequestDetail?.amount || '',
      project: financialRequestDetail?.project?.id || '',
      address: financialRequestDetail?.address || '',
      ...(me.role !== ROLES.DEVELOPER
        ? {
            sender: financialRequestDetail?.requester.id || ''
          }
        : {}),
      payment_account: financialRequestDetail?.payment_account?.id || '',
      requested_at: financialRequestDetail?.requested_at || '',
      description: financialRequestDetail?.description || ''
    }),
    [financialRequestDetail, me.role]
  )

  const handleSubmit = useCallback(
    (values, formActions) => {
      return formSubmit(
        updateFinancialRequestDetail,
        {
          data: serializeFinancialRequest(values),
          id: params.id,
          success: () => history.push(`/${URL_PREFIXES[me.role]}/financial-requests`)
        },
        formActions
      )
    },
    [updateFinancialRequestDetail, params.id, history, me.role]
  )

  if (isDetailLoading) return <Spinner />
  else
    return (
      <Grid container>
        <Grid item xs={12}>
          <Widget title="Financial Request Edit" disableWidgetMenu>
            <Formik
              component={FinancialRequestEditForm}
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={handleSubmit}></Formik>
          </Widget>
        </Grid>
      </Grid>
    )
}

const actions = {
  getFinancialRequestDetail,
  updateFinancialRequestDetail
}

const selectors = createStructuredSelector({
  financialRequestDetail: financialRequestDetailSelector,
  isDetailLoading: financialRequestDetailLoadingSelector,
  me: meSelector
})

FinancialRequestEdit.propTypes = {
  getFinancialRequestDetail: PropTypes.func.isRequired,
  updateFinancialRequestDetail: PropTypes.func.isRequired,
  financialRequestDetail: PropTypes.object,
  isDetailLoading: PropTypes.bool.isRequired,
  params: PropTypes.object,
  me: PropTypes.object,
  show: PropTypes.func
}

export default compose(withRouter, connect(selectors, actions))(FinancialRequestEdit)
