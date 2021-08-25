import { takeLatest } from 'redux-saga/effects'
import { apiCallSaga } from '../api'
import * as Types from './types'
import { roleBasedPath } from 'helpers/sagaHelpers'

const getTeamReport = apiCallSaga({
  type: Types.GET_TEAMREPORT,
  method: 'GET',
  path: function*({ payload }) {
    return yield roleBasedPath(`reports/team/${payload.period}/`)
  },
  selectorKey: 'teamReport',
  allowedParamKeys: ['from', 'to']
})

export default function* rootSaga() {
  yield takeLatest(Types.GET_TEAMREPORT, getTeamReport)
}