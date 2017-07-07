// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React, { Component, isValidElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import PropTypes from 'prop-types'
import bindEvents from '../../lib/bind-events'
import mapLocationToPosition from '../../lib/map-location-to-position'
import type {
  MapComponent,
  MapComponentContext,
  EventMap
} from '../../lib/base-interface'

type InfoWindowEvents = {
  onChange?: Function,
  onOpen?: Function,
  onClose?: Function
}

type Prop = {
  disabled?: boolean,
  children?: React.Element<*> | string
} & typeof AMap.InfoWindowOptions &
  InfoWindowEvents

class InfoWindow extends Component<void, Prop, void> implements MapComponent {
  AMap: typeof AMap
  map: AMap.Map
  props: Prop
  events: EventMap = {}
  context: MapComponentContext
  infowindow: AMap.InfoWindow

  load(): Promise<void> {
    const { AMap, map } = this.context

    function setInfoWindow(
      location: ?([number, number] | { position: AMap.LngLat })
    ) {
      const loc = !location || Array.isArray(location)
        ? location
        : location.position
      this.infowindow = new AMap.InfoWindow({
        ...this.props,
        position: loc,
        content: stringifyContent(this.props.children)
      })
    }

    return mapLocationToPosition(AMap, this.props.position).then(
      setInfoWindow.bind(this)
    )
  }

  componentWillReceiveProps(nextProps: Prop): void {
    const { map } = this.context

    if (nextProps.position && nextProps.position !== this.props.position) {
      if (typeof nextProps.position !== 'string') {
        this.map.setCenter(nextProps.position)
      } else {
        mapLocationToPosition(
          this.AMap,
          nextProps.position
        ).then((location: ?LocationCenter) => {
          if (location) {
            const loc = Array.isArray(location) ? location : location.position
            this.infowindow.setPosition(loc)
          }
        })
      }
    }

    if (nextProps.children) {
      // TODO store or cache content
      const ctx: ?string = stringifyContent(nextProps.children)
      if (ctx && ctx === stringifyContent(this.props.children)) {
        this.infowindow.setContent(ctx)
      }
    }
  }

  shouldComponentUpdate() {
    return false
  }

  componentDidMount() {
    const { AMap, map } = this.context
    const { disabled, position } = this.props

    function ready() {
      if (disabled) {
        this.infowindow.close()
      } else {
        this.infowindow.open(map)
      }
      this.events = bindEvents(AMap, this.infowindow, this.props)
    }

    this.load().then(ready.bind(this))
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

function stringifyContent(content: $PropertyType<Prop, 'children'>): ?string {
  const ctx: $PropertyType<Prop, 'children'> = content

  if (process.env.NODE_ENV === 'development') {
    !ctx &&
      console.warn(`<InfoWindow /> \
Component wan't contents, but got null. Set default content to 'undefined'.`)
  }

  if (!ctx) {
    return undefined
  }

  if (typeof ctx === 'string' || !isValidElement(ctx)) {
    return String(ctx)
  }

  return renderToStaticMarkup(ctx)
}

export default InfoWindow
