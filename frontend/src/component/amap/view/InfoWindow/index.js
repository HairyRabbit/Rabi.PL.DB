// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React, { Component, isValidElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import PropTypes from 'prop-types'
import bindEvents from '../../lib/bind-events'
import type MapComponent, { EventMap } from '../../lib/base-interface'

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

class InfoWindow extends Component<void, Prop, void> implements MapComponent {
  AMap: typeof AMap
  map: AMap.Map
  props: Prop
  events: EventMap = {}
  context: Context

  load() {
    const { AMap, map } = this.context
    const {
      isCustom,
      autoMove,
      closeWhenClickMap,
      position,
      children
    } = this.props
    this.infowindow = new AMap.InfoWindow({
      isCustom,
      autoMove,
      position,
      closeWhenClickMap,
      content: setContent(children)
    })
  }

  componentWillReceiveProps(nextProps) {
    const { map } = this.context
    const { infowindow } = this

    if (nextProps.position !== this.props.position) {
      infowindow.setPosition(nextProps.position)
    }

    // TODO always set children
    nextProps.children && infowindow.setContent(setContent(nextProps.children))
  }

  shouldComponentUpdate() {
    return false
  }

  componentDidMount() {
    const { AMap, map } = this.context
    const { disabled, position } = this.props

    this.load()
    if (disabled) {
      this.infowindow.close()
    } else {
      this.infowindow.open(map)
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

function setContent(content: any): ?string {
  return (
    content &&
    (isValidElement(content) ? renderToStaticMarkup(content) : String(content))
  )
}

export default InfoWindow
