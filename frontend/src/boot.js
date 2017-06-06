// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import Root from './index'

/// Hot module replacment

if (module.hot) {
  module.hot.accept('./index', main)
}

/// Main

function main(): void {
  let Wrapper: React.Element<*>
  const node = document.getElementById('app')

  if (process.env.NODE_ENV === 'development') {
    const { AppContainer } = require('react-hot-loader')

    Wrapper = (
      <AppContainer>
        <Root />
      </AppContainer>
    )
  } else {
    Wrapper = <Root />
  }

  ReactDOM.render(Wrapper, node)
}

/// Bootstrapper

main()
