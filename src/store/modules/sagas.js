import { all } from 'redux-saga/effects'

import { saga as auth } from './auth'
import { saga as users} from './users'
import { saga as teams } from './teams'
import { saga as profiles } from './profiles'

export default function* rootSaga() {
  yield all([
    auth(),
    users(),
    teams(),
    profiles(),
  ])
}
