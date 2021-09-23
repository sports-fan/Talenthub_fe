import setWith from 'lodash/setWith'
import unset from 'lodash/unset'
import * as R from 'ramda'
import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'

import { REQUEST_SUCCESS, REQUEST_REJECTED, REQUEST_PENDING, SET_API_DATA, CLEAR_API_STATE } from './types'

export const requests = handleActions(
  {
    [REQUEST_PENDING]: (state, { payload }) => {
      const selectorKey = payload.requestSelectorKey || payload.selectorKey
      return {
        ...state,
        [selectorKey]: {
          ...state[selectorKey],
          [R.toLower(payload.method)]: REQUEST_PENDING
        }
      }
    },

    [REQUEST_SUCCESS]: (state, { payload }) => {
      const selectorKey = payload.requestSelectorKey || payload.selectorKey
      return {
        ...state,
        [selectorKey]: {
          ...state[selectorKey],
          [R.toLower(payload.method)]: REQUEST_SUCCESS
        }
      }
    },

    [REQUEST_REJECTED]: (state, { payload }) => {
      const selectorKey = payload.requestSelectorKey || payload.selectorKey
      return {
        ...state,
        [selectorKey]: {
          ...state[selectorKey],
          [R.toLower(payload.method)]: REQUEST_REJECTED
        }
      }
    },

    [CLEAR_API_STATE]: R.always({})
  },
  {}
)

// TODO: find a better way to resolve cloning issue
const cloneInPath = (state, path) => {
  if (!path) return state
  const pathArray = Array.isArray(path) ? path : path.split('.')
  pathArray.reduce((subState, path) => {
    subState[path] = Array.isArray(subState[path]) ? [...subState[path]] : { ...subState[path] }
    return subState[path]
  }, state)
  return { ...state }
}

export const data = handleActions(
  {
    [REQUEST_SUCCESS]: (state, { payload }) => {
      return cloneInPath(setWith(state, payload.selectorKey, payload.data, Object), payload.selectorKey)
    },

    [SET_API_DATA]: (state, { payload }) => {
      return cloneInPath(setWith(state, payload.selectorKey, payload.data, Object), payload.selectorKey)
    },

    [CLEAR_API_STATE]: R.always({}),

    [REQUEST_REJECTED]: (state, { payload }) => {
      if (payload.method.toLowerCase() === 'get') {
        unset(state, payload.selectorKey)
      }
      return state
    }
  },
  {}
)

export default combineReducers({
  data,
  requests
})
