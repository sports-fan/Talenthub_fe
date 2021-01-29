import { combineReducers } from 'redux'

import api from './api'
import auth from './auth'
import users from './users'
import teams from './teams'
import profiles from './profiles'
import accounts from './accounts'
import clients from './clients'
import message from './message'
import partners from './partners'

export default combineReducers({
  api,
  isAuthenticated: auth,
  users,
  teams,
  profiles,
  accounts,
  clients,
  message,
  partners
})
