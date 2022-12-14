import React, { useEffect } from 'react'
import { Router } from 'react-router-dom'
import Routes from './routes'
import { history } from './store'
import { authGetMe, isAuthenticatedSelector, meLoadingSelector } from './store/modules/auth'
import { getNotificationPermission } from './store/modules/notification'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Spinner from './components/Spinner'
import Message from './components/Message'
import PropTypes from 'prop-types'
import ConfirmModal from 'components/ConfirmModal'
import TeamReportModal from 'components/TeamReportModal'
import IndividualReportModal from 'components/IndividualReportModal'
import TransactionDetailModal from 'components/TransactionDetailModal'
import FinancialRequestDetailModal from 'components/FinancialRequestDetailModal'

function App({ isAuthenticated, authGetMe, meLoading, getNotificationPermission }) {
  useEffect(() => {
    isAuthenticated && authGetMe()
  }, [isAuthenticated, authGetMe])

  useEffect(() => {
    isAuthenticated && getNotificationPermission()
  }, [isAuthenticated, getNotificationPermission])

  if (isAuthenticated && meLoading) {
    return <Spinner />
  } else {
    return (
      <>
        <Router history={history}>
          <Routes />
          <Message />
          <ConfirmModal />
        </Router>
        <TeamReportModal />
        <IndividualReportModal />
        <TransactionDetailModal />
        <FinancialRequestDetailModal />
      </>
    )
  }
}

const actions = {
  authGetMe,
  getNotificationPermission
}

const selectors = createStructuredSelector({
  isAuthenticated: isAuthenticatedSelector,
  meLoading: meLoadingSelector
})

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  authGetMe: PropTypes.func.isRequired,
  meLoading: PropTypes.bool.isRequired
}

export default connect(selectors, actions)(App)
