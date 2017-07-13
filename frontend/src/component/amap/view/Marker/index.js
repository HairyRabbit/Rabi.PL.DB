// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import type {
  MapComponent,
  MapComponentContext,
  EventMap
} from '../../lib/base-interface'

type Prop = {}

class Marker extends Component implements MapComponent {
  AMap: typeof AMap
  map: AMap.Map
  props: Prop
  events: EventMap = {}
  context: MapComponentContext
  marker: AMap.Marker

  load() {
    const { position } = this.props
    const { AMap, map } = this.context
    this.marker = new AMap.Marker({
      position: position
    })
  }

  componentDidMount() {
    const { map } = this.context

    this.load()
    map.add(this.marker)
  }

  componentWillUnmount() {
    const { map } = this.context
    map.remove(this.marker)
  }

  render() {
    return null
  }
}

Marker.contextTypes = {
  AMap: PropTypes.object,
  map: PropTypes.object
}

export default Marker
