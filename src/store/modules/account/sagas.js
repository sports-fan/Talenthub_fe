import { takeLatest } from 'redux-saga/effects'
import { apiCallSaga } from '../api'
import * as Types from './types'
import { roleBasedPath } from 'helpers/sagaHelpers'

const getAccounts = apiCallSaga({
  type: Types.GET_ACCOUNTS,
  method: 'GET',
  path: function*() {
    return yield roleBasedPath('accounts/')
  },
  selectorKey: 'accounts'
})

const deleteAccount = apiCallSaga({
  type: Types.DELETE_ACCOUNT,
  method: 'DELETE',
  path: function*({ payload }) {
    return yield roleBasedPath(`accounts/${payload}/`)
  }
})

const deleteAccountAndRefresh = function*(action) {
  yield deleteAccount(action)
  yield getAccounts({
    type: Types.GET_ACCOUNTS
  })
}

const getAccountDetail = apiCallSaga({
  type: Types.GET_ACCOUNTDETAIL,
  method: 'GET',
  path: function*({ payload }) {
    return yield roleBasedPath(`accounts/${payload}/`)
  },
  selectorKey: 'accountDetail'
})

const updateAccount = apiCallSaga({
  type: Types.GET_ACCOUNTDETAIL,
  method: 'PUT',
  path: function*({ payload: { id } }) {
    return yield roleBasedPath(`accounts/${id}/`)
  }
})

const createAccount = apiCallSaga({
  type: Types.CREATE_ACCOUNT,
  method: 'POST',
  path: function*() {
    return yield roleBasedPath(`accounts/`)
  }
})

export default function* rootSaga() {
  yield takeLatest(Types.GET_ACCOUNTS, getAccounts)
  yield takeLatest(Types.DELETE_ACCOUNT, deleteAccount)
  yield takeLatest(Types.DELETE_ACCOUNT_AND_REFRESH, deleteAccountAndRefresh)
  yield takeLatest(Types.GET_ACCOUNTDETAIL, getAccountDetail)
  yield takeLatest(Types.UPDATE_ACCOUNT, updateAccount)
  yield takeLatest(Types.CREATE_ACCOUNT, createAccount)
}
