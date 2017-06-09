// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React, { Component } from 'react'
import eq from 'lodash/eq'
import PromiseHash from './promise-hash'

type Props = {
  modules: {
    [any]: Promise<*>
  },
  children: Function
}

type State = {
  loaded: boolean,
  modules: ?{
    [any]: React.Element<*>
  }
}

class LazyComponent extends Component<*, Props, State> {
  mounted: boolean = false

  state = {
    loaded: false,
    modules: null
  }

  componentDidMount(): void {
    this.mounted = true
    this.load()
  }

  componentWillUnmount(): void {
    this.mounted = false
  }

  componentWillReceiveProps(nextProps: Props): void {
    eq(this.props.modules, nextProps.modules) ? this.load() : null
  }

  load(): void {
    this.setState({ loaded: false })

    PromiseHash(this.props.modules).then(results => {
      if (!this.mounted) return null
      this.setState({ modules: results, loaded: true })
    })
  }

  render() {
    if (!this.state.loaded) return null
    return React.Children.only(this.props.children(this.state.modules))
  }
}

export default LazyComponent
