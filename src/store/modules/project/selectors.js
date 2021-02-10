import * as R from 'ramda'
import { createDataSelector, isRequestPending } from '../api'

export const projectsSelector = R.compose(
  R.path(['results']),
  createDataSelector('projects')
)

export const projectsLoadingSelector = state => isRequestPending('projects', 'GET')(state)

export const projectDetailSelector = createDataSelector('projectDetail')
export const projectDetailLoadingSelector = state => isRequestPending('projectDetail', 'get')(state)