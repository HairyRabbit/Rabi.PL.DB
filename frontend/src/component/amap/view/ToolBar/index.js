// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import bindEvents from '../../lib/bind-events'
import type { MapComponent } from '../../lib/base-interface'
import Marker from '../Marker'

type Prop = {
  position: 'LT' | 'RT' | 'LB' | 'RB',
  ruler: boolean,
  locate: boolean,
  direction: boolean,
  disabled: boolean,
  locationMarker: Marker,
  onShow: Function,
  onHide: Function,
  onLocation: Function,
  onZoomChanged: Function,
  children?: React.Element<*>
}

class ToolBar extends Component implements MapComponent {
  props: Prop
  context: Context

  componentWillReceiveProps(nextProps) {
    const { toolbar } = this

    const keys: string = Object.keys(nextProps)
      .filter(x => !/^(on|children)/.test(x))
      .filter(key => nextProps !== this.props)
      .forEach(key => {
        if (key === 'disabled') {
          if (Boolean(nextProps.disabled)) {
            toolbar.hide()
          } else {
            toolbar.show()
          }
          return
        }

        const upperFirstKey: string = key.replace(/(.)/, (_, a) =>
          a.toUpperCase()
        )
        const process: string =
          (Boolean(nextProps[key]) ? 'show' : 'hide') + upperFirstKey

        toolbar[process] && toolbar[process]()
      })
  }
  componentDidMount() {
    if (!AMap.ToolBar) {
      AMap.plugin('AMap.ToolBar', this.load.bind(this))
    } else {
      this.load()
    }
  }
  load() {
    const { AMap, map } = this.context
    const {
      position,
      ruler,
      locate,
      direction,
      autoPosition,
      disabled,
      children,

      onShow,
      onHide,
      onLocation,
      onZoomChanged
    } = this.props

    let locationMarker = undefined

    if (children) {
      const marker = new children.type(children.props, this.context)
      marker.load()
      locationMarker = marker.marker
    }

    const toolbar = (this.toolbar = new AMap.ToolBar({
      position,
      ruler: ruler === undefined ? true : ruler,
      locate,
      direction: direction === undefined ? true : direction,
      autoPosition,
      locationMarker
    }))

    // NOTE toolbar visible
    if (disabled) {
      toolbar.hide()
    }

    this.events = bindEvents(AMap, toolbar, this.props)
    map.addControl(toolbar)
  }
  componentWillUnmount() {
    const { AMap, map } = this.context
    const { toolbar, events } = this

    map.removeControl(toolbar)

    Object.keys(events).forEach(key => {
      AMap.event.removeListener(events[key])
      delete events[key]
    })
  }

  render() {
    return null
  }
}

ToolBar.contextTypes = {
  AMap: PropTypes.object,
  map: PropTypes.object
}

export default ToolBar
