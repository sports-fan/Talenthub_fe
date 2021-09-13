import { takeLatest } from 'redux-saga/effects'
import { createApiCallSaga } from '../api'
import * as Types from './types'
import { roleBasedPath } from 'helpers/sagaHelpers'

const getIndividualReport = createApiCallSaga({
  type: Types.GET_INDIVIDUALREPORT,
  method: 'GET',
  path: function*({ payload }) {
    return yield roleBasedPath(`reports/developer/${payload.period}/`)
  },
  selectorKey: 'individualReport',
  allowedParamKeys: ['page', 'page_size', 'from', 'to']
})

export default function* rootSaga() {
  yield takeLatest(Types.GET_INDIVIDUALREPORT, getIndividualReport)
}
