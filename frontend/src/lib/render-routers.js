// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import { Route } from 'react-router-dom'

type RouteOptions = {
  path: 'string',
  render: Function,
  component: React.Element<*>
}

function RouteWithSubRoutes(route: RouteOptions): React.Element<*> {
  return (
    <Route
      path={route.path}
      render={props => <route.component {...props} routes={route.routes} />}
    />
  )
}

export default RouteWithSubRoutes
