import React, { useEffect, useCallback } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'
import { createStructuredSelector } from 'reselect'
import { connectModal } from 'redux-modal'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { show as showModal } from 'redux-modal'
import { FormattedNumber } from 'react-intl'
import PropTypes from 'prop-types'

import useStyle from './styles'
import Spinner from 'components/Spinner'
import {
  getFinancialRequestDetail,
  financialRequestDetailLoadingSelector,
  financialRequestDetailSelector,
  confirmCancelFinancialRequest as cancelFinancialRequest,
  confirmDeclineFinancialRequest as declineFinancialRequest,
  approveFinancialRequest
} from 'store/modules/financialRequest'
import { getUsers } from 'store/modules/user'
import { meSelector } from 'store/modules/auth'
import LabelValue from 'components/LabelValue'
import ApproveRequestModal from 'components/ApproveRequestModal'
import {
  URL_PREFIXES,
  FINANCIALREQUEST_TYPE_LABELS,
  FINANCIALREQUEST_TYPE,
  FINANCIALREQUEST_STATUS_LABELS,
  FINANCIALREQUEST_STATUS,
  ROLES
} from 'config/constants'

const FinancialRequestDetailModal = ({
  getUsers,
  getFinancialRequestDetail,
  financialRequestDetail,
  financialRequestId,
  isFinancialRequestDetailLoading,
  cancelFinancialRequest,
  declineFinancialRequest,
  approveFinancialRequest,
  show,
  handleHide,
  me,
  showModal
}) => {
  const classes = useStyle()
  const role = me.role

  useEffect(() => {
    getFinancialRequestDetail(financialRequestId)
    getUsers()
  }, [getFinancialRequestDetail, getUsers, financialRequestId])

  const handleApprove = useCallback(() => {
    if (financialRequestDetail.type === FINANCIALREQUEST_TYPE.SENDINVOICE) {
      approveFinancialRequest({
        id: financialRequestDetail.id
      })
    } else {
      showModal('approveRequestModal', {
        requestId: financialRequestDetail.id,
        grossAmount: financialRequestDetail.amount,
        paymentAccountId: financialRequestDetail.payment_account.id,
        requestType: financialRequestDetail.type
      })
    }
  }, [showModal, approveFinancialRequest, financialRequestDetail])

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
      success: () => getFinancialRequestDetail(financialRequestId),
      message: 'Are you sure to cancel this request?'
    })
  }, [cancelFinancialRequest, getFinancialRequestDetail, financialRequestId, financialRequestDetail])

  const shouldShowProjectField = Boolean(
    financialRequestDetail &&
      financialRequestDetail.project &&
      financialRequestDetail.type !== FINANCIALREQUEST_TYPE.SENDPAYMENT
  )

  return (
    financialRequestDetail && (
      <>
        <Dialog open={show} onClose={handleHide} fullWidth maxWidth="md">
          <div className={classes.title}>
            <DialogTitle id="form-dialog-title">Financial Request Details</DialogTitle>
            <IconButton onClick={handleHide}>
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent className={classes.paper}>
            {isFinancialRequestDetailLoading ? (
              <Spinner />
            ) : (
              <>
                <Grid container className={classes.row} spacing={2}>
                  <Grid item sm={6}>
                    <LabelValue label="Type">{FINANCIALREQUEST_TYPE_LABELS[financialRequestDetail.type]}</LabelValue>
                    <LabelValue label="Amount">
                      <FormattedNumber format="currency" value={financialRequestDetail.amount} />
                    </LabelValue>
                    <LabelValue label="From/To">{financialRequestDetail.address}</LabelValue>
                  </Grid>
                  <Grid item sm={6}>
                    <LabelValue label="Status">
                      {' '}
                      {FINANCIALREQUEST_STATUS_LABELS[financialRequestDetail.status]}{' '}
                    </LabelValue>
                    {shouldShowProjectField && (
                      <LabelValue label="Project Related">{financialRequestDetail.project.title}</LabelValue>
                    )}
                    <LabelValue label="Payment Account">
                      {financialRequestDetail.payment_account?.display_name || 'None'}
                    </LabelValue>
                  </Grid>
                </Grid>
                <Grid container className={classes.row} spacing={2}>
                  <Grid item sm={12}>
                    <LabelValue label="Description">{financialRequestDetail.description}</LabelValue>
                  </Grid>
                </Grid>
              </>
            )}
          </DialogContent>
          <div className={classes.bottomAction}>
            <Button
              component="a"
              href={`/${URL_PREFIXES[role]}/financial-requests/${financialRequestDetail.id}/detail`}
              target="_blank"
              color="primary">
              View Detail Page
            </Button>
            <DialogActions>
              {ROLES.ADMIN === me.role && financialRequestDetail.status === FINANCIALREQUEST_STATUS.PENDING ? (
                <>
                  <Button className={classes.approveButton} variant="contained" onClick={handleApprove} color="primary">
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
            </DialogActions>
          </div>
        </Dialog>
        <ApproveRequestModal />
      </>
    )
  )
}

const selector = createStructuredSelector({
  me: meSelector,
  financialRequestDetail: financialRequestDetailSelector,
  isFinancialRequestDetailLoading: financialRequestDetailLoadingSelector
})

const actions = {
  getUsers,
  showModal,
  getFinancialRequestDetail,
  cancelFinancialRequest,
  declineFinancialRequest,
  approveFinancialRequest
}

FinancialRequestDetailModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleHide: PropTypes.func.isRequired,
  getFinancialRequestDetail: PropTypes.func.isRequired,
  financialRequestDetail: PropTypes.object,
  isFinancialRequestDetailLoading: PropTypes.bool.isRequired,
  me: PropTypes.object.isRequired
}

export default compose(
  connectModal({ name: 'FinancialRequestDetailModal', destroyOnHide: false }),
  connect(selector, actions)
)(FinancialRequestDetailModal)
