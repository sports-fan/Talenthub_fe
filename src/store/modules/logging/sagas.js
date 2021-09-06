import { takeLatest } from 'redux-saga/effects'
import { apiCallSaga } from '../api'
import * as Types from './types'
import { roleBasedPath } from 'helpers/sagaHelpers'

const getDailyLogs = apiCallSaga({
  type: Types.GET_DAILY_LOGS,
  method: 'GET',
  path: function*({ payload: { date } = {} }) {
    const path = date ? `logging/daily-logs/${date}/` : 'logging/daily-logs/'
    return yield roleBasedPath(path)
  },
  selectorKey: 'dailyLogs',
  allowedParamKeys: ['page', 'page_size']
})

const getDailyLogDetail = apiCallSaga({
  type: Types.GET_DAILY_LOG_DETAIL,
  method: 'GET',
  path: function*({ payload }) {
    return yield roleBasedPath(`logging/daily-logs/${payload.id}/`)
  },
  selectorKey: 'dailyLogDetail'
})

const getMonthlyLogs = apiCallSaga({
  type: Types.GET_MONTHLY_LOGS,
  method: 'GET',
  path: function*({ payload: { year, month } = {} }) {
    const path = year ? `logging/monthly-logs/${year}-${month}/` : 'logging/monthly-logs/'
    return yield roleBasedPath(path)
  },
  selectorKey: 'monthlyLogs',
  allowedParamKeys: ['page', 'page_size']
})

const getMonthlyLogDetail = apiCallSaga({
  type: Types.GET_MONTHLY_LOG_DETAIL,
  method: 'GET',
  path: function*({ payload }) {
    return yield roleBasedPath(`logging/monthly-logs/${payload.id}/`)
  },
  selectorKey: 'monthlyLogDetail'
})

const getWeeklyLogs = apiCallSaga({
  type: Types.GET_WEEKLY_LOGS,
  method: 'GET',
  path: function*({ payload: { year, week } = {} }) {
    const path = year ? `logging/weekly-logs/${year}-${week}/` : 'logging/weekly-logs/'
    return yield roleBasedPath(path)
  },
  selectorKey: 'weeklyLogs',
  allowedParamKeys: ['page', 'page_size']
})

const getWeeklyLogDetail = apiCallSaga({
  type: Types.GET_WEEKLY_LOG_DETAIL,
  method: 'GET',
  path: function*({ payload }) {
    return yield roleBasedPath(`logging/weekly-logs/${payload.id}/`)
  },
  selectorKey: 'weeklyLogDetail'
})

export default function* rootSaga() {
  yield takeLatest(Types.GET_DAILY_LOGS, getDailyLogs)
  yield takeLatest(Types.GET_DAILY_LOG_DETAIL, getDailyLogDetail)
  yield takeLatest(Types.GET_MONTHLY_LOGS, getMonthlyLogs)
  yield takeLatest(Types.GET_MONTHLY_LOG_DETAIL, getMonthlyLogDetail)
  yield takeLatest(Types.GET_WEEKLY_LOGS, getWeeklyLogs)
  yield takeLatest(Types.GET_WEEKLY_LOG_DETAIL, getWeeklyLogDetail)
}