// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import bindEvents from '../../lib/bind-events'
import type { MapComponent } from '../../lib/base-interface'

type Prop = {
  position: 'LT' | 'RT' | 'LB' | 'RB',
  disabled: boolean,
  onShow: Function,
  onHide: Function
}

class Scale extends Component implements MapComponent {
  props: Prop
  context: Context

  componentWillReceiveProps(nextProps) {
    const { scale } = this
    if (nextProps.disabled !== this.props.disabled) {
      if (Boolean(nextProps.disabled)) {
        scale.hide()
      } else {
        scale.show()
      }
    }
  }
  componentDidMount() {
    const ready = () => {
      this.load()
      if (this.props.disabled) {
        this.scale.hide()
      }
      this.events = bindEvents(this.context.AMap, this.scale, this.props)
      this.context.map.addControl(this.scale)
    }

    if (!AMap.Scale) {
      AMap.plugin('AMap.Scale', ready.bind(this))
    } else {
      ready()
    }
  }
  load() {
    const { AMap } = this.context
    const { position } = this.props

    this.scale = new AMap.Scale({
      position: position || 'LB'
    })
  }
  componentWillUnmount() {
    const { AMap, map } = this.context
    const { scale, events } = this

    map.removeControl(scale)

    Object.keys(events).forEach(key => {
      AMap.event.removeListener(events[key])
      delete events[key]
    })
  }

  render() {
    return null
  }
}

Scale.contextTypes = {
  AMap: PropTypes.object,
  map: PropTypes.object
}

export default Scale
