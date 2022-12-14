import React, { useEffect, useCallback } from 'react'
import { Grid, Button } from '@material-ui/core'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'
import { FormattedNumber } from 'react-intl'
import PropTypes from 'prop-types'
import { show } from 'redux-modal'
import { Link } from 'react-router-dom'

import Widget from 'components/Widget'
import ApproveRequestModal from 'components/ApproveRequestModal'
import {
  getFinancialRequestDetail,
  financialRequestDetailSelector,
  financialRequestDetailLoadingSelector,
  confirmCancelFinancialRequest as cancelFinancialRequest,
  confirmDeclineFinancialRequest as declineFinancialRequest,
  approveFinancialRequest
} from 'store/modules/financialRequest'
import useStyles from './styles'
import Spinner from 'components/Spinner'
import { meSelector } from 'store/modules/auth'
import {
  URL_PREFIXES,
  FINANCIALREQUEST_TYPE_LABELS,
  FINANCIALREQUEST_TYPE,
  FINANCIALREQUEST_STATUS,
  FINANCIALREQUEST_STATUS_LABELS,
  ROLES
} from 'config/constants'
import LabelValue from 'components/LabelValue'

const FinancialRequestDetail = ({
  getFinancialRequestDetail,
  financialRequestDetail,
  isDetailLoading,
  match: { params, url },
  me,
  history,
  location,
  approveFinancialRequest,
  declineFinancialRequest,
  cancelFinancialRequest,
  show
}) => {
  useEffect(() => {
    getFinancialRequestDetail(params.id)
  }, [getFinancialRequestDetail, params])

  const classes = useStyles()

  const handleGoBack = useCallback(() => {
    location.state ? history.push(location.state) : history.push(`/${URL_PREFIXES[me.role]}/financial-requests`)
  }, [location, history, me])

  const handleApprove = useCallback(() => {
    if (financialRequestDetail.type === FINANCIALREQUEST_TYPE.SENDINVOICE) {
      approveFinancialRequest({
        id: financialRequestDetail.id
      })
    } else {
      show('approveRequestModal', {
        requestId: financialRequestDetail.id,
        grossAmount: financialRequestDetail.amount,
        paymentAccountId: financialRequestDetail.payment_account.id,
        requestType: financialRequestDetail.type
      })
    }
  }, [show, approveFinancialRequest, financialRequestDetail])

  const handleDecline = useCallback(
    () =>
      declineFinancialRequest({
        id: financialRequestDetail.id,
        message: 'Are you sure to decline this request?'
      }),
    [declineFinancialRequest, financialRequestDetail]
  )

  const handleCancel = useCallback(() => {
    cancelFinancialRequest({
      id: financialRequestDetail.id,
      success: () => getFinancialRequestDetail(params.id),
      message: 'Are you sure to cancel this request?'
    })
  }, [cancelFinancialRequest, getFinancialRequestDetail, params.id, financialRequestDetail])

  const showFinancialRequestEdit = useCallback(
    id => () => {
      history.push(`/${URL_PREFIXES[me.role]}/financial-requests/${id}/edit`, location.pathname)
    },
    [history, location.pathname, me.role]
  )

  const canEdit =
    ROLES.ADMIN !== me.role &&
    financialRequestDetail &&
    financialRequestDetail.requester.id === me.id &&
    financialRequestDetail.status === FINANCIALREQUEST_STATUS.PENDING

  const shouldShowProjectField = Boolean(
    financialRequestDetail &&
      financialRequestDetail.project &&
      financialRequestDetail.type !== FINANCIALREQUEST_TYPE.SENDPAYMENT
  )

  if (isDetailLoading) return <Spinner />
  else
    return (
      <>
        <Grid container>
          <Grid item xs={12}>
            <Widget
              title="Financial Request Details"
              disableWidgetMenu
              WidgetButton={
                canEdit ? (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={showFinancialRequestEdit(financialRequestDetail.id)}>
                    Edit
                  </Button>
                ) : null
              }>
              {financialRequestDetail && (
                <>
                  <Grid container className={classes.row} spacing={2}>
                    <Grid item sm={6}>
                      <LabelValue label="Type">{FINANCIALREQUEST_TYPE_LABELS[financialRequestDetail.type]}</LabelValue>
                    </Grid>
                    <Grid item sm={6}>
                      <LabelValue label="Status">
                        {' '}
                        {FINANCIALREQUEST_STATUS_LABELS[financialRequestDetail.status]}{' '}
                      </LabelValue>
                    </Grid>
                  </Grid>
                  <Grid container className={classes.row} spacing={2}>
                    <Grid item sm={6}>
                      <LabelValue label="Amount">
                        <FormattedNumber format="currency" value={financialRequestDetail.amount} />
                      </LabelValue>
                    </Grid>
                    {shouldShowProjectField && (
                      <Grid item sm={6}>
                        <LabelValue label="Project Related">
                          <Link
                            to={`/${URL_PREFIXES[me.role]}/projects/${financialRequestDetail.project.id}/detail`}
                            color="primary">
                            {financialRequestDetail.project.title}
                          </Link>
                        </LabelValue>
                      </Grid>
                    )}
                  </Grid>
                  <Grid container className={classes.row} spacing={2}>
                    <Grid item>
                      <LabelValue label="Address">{financialRequestDetail.address}</LabelValue>
                    </Grid>
                  </Grid>

                  <Grid container className={classes.row} spacing={2}>
                    <Grid item sm={6}>
                      <LabelValue label="Description">{financialRequestDetail.description}</LabelValue>
                    </Grid>
                    <Grid item sm={6}>
                      <LabelValue label="Payment Account">
                        {financialRequestDetail.payment_account.display_name}
                      </LabelValue>
                    </Grid>
                  </Grid>

                  <div className={classes.hrline} />
                  {ROLES.ADMIN === me.role && financialRequestDetail.status === FINANCIALREQUEST_STATUS.PENDING ? (
                    <>
                      <Button
                        className={classes.approveButton}
                        variant="contained"
                        onClick={handleApprove}
                        color="primary">
                        Approve
                      </Button>
                      <Button variant="contained" onClick={handleDecline} color="secondary">
                        Decline
                      </Button>
                    </>
                  ) : null}
                  {ROLES.ADMIN !== me.role && financialRequestDetail.status === FINANCIALREQUEST_STATUS.DECLINED ? (
                    <Button variant="contained" onClick={handleCancel} color="secondary">
                      Cancel
                    </Button>
                  ) : null}
                  <Button className={classes.cancelButton} onClick={handleGoBack} color="secondary">
                    Go Back
                  </Button>
                </>
              )}
            </Widget>
          </Grid>
        </Grid>
        <ApproveRequestModal />
      </>
    )
}

const actions = {
  getFinancialRequestDetail,
  cancelFinancialRequest,
  declineFinancialRequest,
  approveFinancialRequest,
  show
}

const selectors = createStructuredSelector({
  financialRequestDetail: financialRequestDetailSelector,
  isDetailLoading: financialRequestDetailLoadingSelector,
  me: meSelector
})

FinancialRequestDetail.propTypes = {
  financialRequestDetail: PropTypes.object,
  isDetailLoading: PropTypes.bool.isRequired,
  cancelFinancialRequest: PropTypes.func.isRequired,
  declineFinancialRequest: PropTypes.func.isRequired,
  approveFinancialRequest: PropTypes.func.isRequired,
  match: PropTypes.object,
  me: PropTypes.object,
  show: PropTypes.func
}

export default compose(withRouter, connect(selectors, actions))(FinancialRequestDetail)
