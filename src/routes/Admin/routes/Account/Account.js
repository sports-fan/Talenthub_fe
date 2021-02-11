import React, { useCallback, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@material-ui/core'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { path } from 'ramda'

import Widget from 'components/Widget'
import Spinner from 'components/Spinner'
import AccountTable from './AccountTable'
import { getAccounts, deleteAccountAndRefresh, accountsSelector, accountsLoadingSelector } from 'store/modules/account'
import { meSelector } from 'store/modules/auth'

const Account = ({ getAccounts, deleteAccountAndRefresh, accounts, loadingAccounts, me }) => {
  useEffect(() => {
    getAccounts()
  }, [getAccounts])

  const data = useMemo(() => {
    return accounts
      ? accounts.map(account => ({
          ...account,
          profile: `${path(['profile', 'first_name'], account)} ${path(['profile', 'last_name'], account)}`
        }))
      : null
  }, [accounts])

  const handleDelete = useCallback(
    id => {
      deleteAccountAndRefresh(id)
    },
    [deleteAccountAndRefresh]
  )

  if (loadingAccounts) return <Spinner />
  else
    return (
      <Grid container>
        <Grid item xs={12}>
          <Widget title="Accounts" noBodyPadding disableWidgetMenu>
            <AccountTable data={data} myRole={me.role} handleDelete={handleDelete} />
          </Widget>
        </Grid>
      </Grid>
    )
}

Account.propTypes = {
  getAccounts: PropTypes.func.isRequired,
  deleteAccountAndRefresh: PropTypes.func.isRequired,
  accounts: PropTypes.array,
  loadingAccounts: PropTypes.bool.isRequired,
  me: PropTypes.object
}

const actions = {
  getAccounts,
  deleteAccountAndRefresh
}

const selectors = createStructuredSelector({
  accounts: accountsSelector,
  loadingAccounts: accountsLoadingSelector,
  me: meSelector
})

export default connect(
  selectors,
  actions
)(Account)