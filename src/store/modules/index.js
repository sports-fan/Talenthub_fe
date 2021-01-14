import { combineReducers } from 'redux'

import api from './api'
import auth from './auth'
import users from './users'
import teams from './teams'
import profiles from './profiles'

export default combineReducers({
  api,
  isAuthenticated: auth,
  users,
  teams,
  profiles
})
