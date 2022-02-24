import React from 'react'
import { Redirect, Switch, Route } from 'react-router'
import PropTypes from 'prop-types'

import PaymentAccountList from '../../routes/PaymentAccountList'

const Project = ({ match: { path } }) => (
  <Switch>
    <Route exact path={`${path}`} component={PaymentAccountList} />
    <Redirect to={`${path}`} />
  </Switch>
)

Project.propTypes = {
  match: PropTypes.object.isRequired
}

export default Project
