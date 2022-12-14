import React, { useCallback, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { withRouter } from 'react-router'
import { show } from 'redux-modal'
import { Grid } from '@material-ui/core'
import { Formik } from 'formik'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { compose } from 'redux'

import withPaginationInfo from 'hocs/withPaginationInfo'
import Widget from 'components/Widget'
import Spinner from 'components/Spinner'
import SearchForm from 'components/SearchForm'
import TrackButton from 'components/TrackButton'
import AccountTable from '../../components/AccountTable'
import { URL_PREFIXES } from 'config/constants'
import { meSelector } from 'store/modules/auth'
import { ListDataType } from 'helpers/prop-types'
import { jsonToQueryString, parseQueryString } from 'helpers/utils'
import { getAccounts, deleteAccountAndRefresh, accountsSelector, accountsLoadingSelector } from 'store/modules/account'

const AccountList = ({
  getAccounts,
  deleteAccountAndRefresh,
  accounts,
  loadingAccounts,
  me,
  show,
  pagination,
  onChangePage,
  onChangeRowsPerPage,
  history,
  location
}) => {
  const initialValues = useMemo(() => {
    return R.pick(['search'], parseQueryString(location.search))
  }, [location])

  useEffect(() => {
    getAccounts({
      params: { ...pagination, ...initialValues }
    })
  }, [getAccounts, pagination, initialValues])

  const handleDelete = useCallback(
    id =>
      deleteAccountAndRefresh({
        id,
        message: 'Are you sure to delete this account?'
      }),
    [deleteAccountAndRefresh]
  )

  const handleSubmit = useCallback(
    (formValues, formActinos) => {
      history.push({
        search: jsonToQueryString({
          ...pagination,
          ...formValues
        })
      })
    },
    [history, pagination]
  )

  if (loadingAccounts) return <Spinner />
  else
    return (
      <Grid container>
        <Grid item xs={12}>
          <Widget
            title="Accounts"
            noBodyPadding
            disableWidgetMenu
            WidgetButton={
              <TrackButton trackType="push" color="primary" to={`/${URL_PREFIXES[me.role]}/accounts/new`}>
                Add a Account
              </TrackButton>
            }>
            <Formik initialValues={initialValues} component={SearchForm} onSubmit={handleSubmit} />
            <AccountTable
              data={accounts}
              handleDelete={handleDelete}
              pagination={pagination}
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          </Widget>
        </Grid>
      </Grid>
    )
}

AccountList.propTypes = {
  getAccounts: PropTypes.func.isRequired,
  deleteAccountAndRefresh: PropTypes.func.isRequired,
  accounts: ListDataType,
  loadingAccounts: PropTypes.bool.isRequired,
  me: PropTypes.object,
  show: PropTypes.func.isRequired,
  pagination: PropTypes.object
}

const actions = {
  getAccounts,
  deleteAccountAndRefresh,
  show
}

const selectors = createStructuredSelector({
  accounts: accountsSelector,
  loadingAccounts: accountsLoadingSelector,
  me: meSelector
})

export default compose(withRouter, withPaginationInfo, connect(selectors, actions))(AccountList)
