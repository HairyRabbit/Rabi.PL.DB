// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import { Route } from 'react-router-dom'
import Lazy from './lazy-component'

function AsyncRoute({
  component,
  ...props
}: {
  component: Promise<*>
}): React.Element<*> {
  if (props.component) {
    delete props.component
  }

  return (
    <Route
      {...props}
      render={() =>
        <Lazy modules={{ Module: component }}>
          {({ Module }) => {
            return <Module.default />
          }}
        </Lazy>}
    />
  )
}

export default AsyncRoute
