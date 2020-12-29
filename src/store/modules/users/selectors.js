import * as R from 'ramda'
import { dataSelector } from '../api'

export const usersSelector = R.compose(
  R.path(['results']),
  dataSelector('users')
)