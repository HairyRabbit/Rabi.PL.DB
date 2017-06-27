// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import bindEvents from '../../lib/bind-events'
import type { MapComponent, LngLat, Pixel } from '../../lib/base-interface'

type Prop = {
  isCustom: boolean,
  autoMove: boolean,
  closeWhenClickMap: boolean,
  shadow: boolean,
  disabled: boolean,
  children: React.Element<*>,
  //size: Size,
  //offset: Pixel,
  position: LngLat,
  onChange: Function,
  onOpen: Function,
  onClose: Function
}

class InfoWindow extends Component implements MapComponent {
  props: Prop
  context: Context

  load() {
    const { AMap, map } = this.context
    const { isCustom, autoMove, closeWhenClickMap, children } = this.props
    this.infowindow = new AMap.InfoWindow({
      isCustom,
      autoMove,
      closeWhenClickMap,
      content: children
    })
  }

  componentDidMount() {
    const { AMap, map } = this.context
    const { disabled, position } = this.props

    this.load()
    if (disabled) {
      this.infowindow.close()
    } else {
      this.infowindow.open(map, position)
    }
    this.events = bindEvents(AMap, this.infowindow, this.props)
  }
  componentWillUnmount() {
    const { map } = this.context
    const { infowindow, events } = this

    Object.keys(events).forEach(key => {
      AMap.event.removeListener(events[key])
      delete events[key]
    })

    map.clearInfoWindow()
  }
  render() {
    return null
  }
}

InfoWindow.contextTypes = {
  AMap: PropTypes.object,
  map: PropTypes.object
}

export default InfoWindow
