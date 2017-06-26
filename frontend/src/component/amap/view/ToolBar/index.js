// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'

type Prop = {
  position: 'LT' | 'RT' | 'LB' | 'RB',
  ruler: boolean,
  locate: boolean,
  direction: boolean,
  disable: boolean,
  children?: React.Element<*>
}

class ToolBar extends Component {
  props: Prop
  context: Context

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled !== this.props.disabled) {
      if (Boolean(nextProps.disabled)) {
        this.toolbar.hide()
      } else {
        this.toolbar.show()
      }
    }

    const keys = Object.keys(nextProps)
    keys.filter(key => nextProps !== this.props).forEach(key => {
      if (key === 'disabled') {
        if (Boolean(nextProps.disabled)) {
          this.toolbar.hide()
        } else {
          this.toolbar.show()
        }
        return
      }

      const upperFirstKey = key.replace(/(.)/, (_, a) => a.toUpperCase())
      const process =
        (Boolean(nextProps[key]) ? 'show' : 'hide') + upperFirstKey
      this.toolbar[process]()
    })
  }
  componentDidMount() {
    if (!AMap.ToolBar) {
      AMap.plugin('AMap.ToolBar', this.load.bind(this))
      return
    }
    this.load()
  }
  load() {
    const { map } = this.context
    const {
      position,
      ruler,
      locate,
      direction,
      autoPosition,

      onToggle,
      onLocation,
      onZoomChanged
    } = this.props

    this.toolbar = new AMap.ToolBar({
      position,
      ruler,
      locate,
      direction,
      autoPosition
    })

    // const evt = AMap.event.addListener(
    //   map,
    //   mapToMapEvent(key),
    //   this.props[key]
    // )
    // this.events.push(evt)

    if (disabled) {
      this.toolbar.hide()
    }
    map.addControl(this.toolbar)
  }
  componentWillUnmount() {
    const { map } = this.context
    map.removeControl(this.toolbar)
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
