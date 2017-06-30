// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import loadMap from '../../lib/load-map'
import mapPositionToLngLat from '../../lib/map-position-to-lnglat'
import bindEvents from '../../lib/bind-events'
import style from './style.css'

function normalizeMapEvent(event: MapEvent): string {
  switch (event) {
    case 'onDoubleClick':
      return 'onDblClick'
    case 'onContextMenu':
      return 'onRightClick'
    case 'onDrag':
      return 'onDragging'
    default:
      return event
  }
}

function mapToMapEvent(event: MapEvent): string {
  return normalizeMapEvent(event).slice(2).toLowerCase()
}

class Map extends Component {
  constructor(props: Prop) {
    super(props)
    this.state = { mount: false }
    this.events = []
    this.AMap = null
    this.map = null
  }
  checkInfoWindow() {
    // TODO
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.zoom !== this.props.zoom) {
      this.map.setZoom(nextProps.zoom)
    }

    if (nextProps.center !== this.props.center) {
      if (typeof nextProps.center !== 'string') {
        this.map.setCenter(nextProps.center)
      } else {
        mapLocationToPosition(nextProps.center).then(location => {
          if (location) {
            this.map.setCenter(location.position)
          }
        })
      }
    }
  }

  load() {
    const { center, zoom } = this.props

    return new Promise((resolve, reject) => {
      mapLocationToPosition(center)
        .then(location => {
          this.map = new AMap.Map(this.container, {
            center: location && location.position,
            zoom,
            mapStyle: 'amap://styles/whitesmoke'
          })
        })
        .then(resolve)
        .catch(reject)
    })
  }
  componentDidMount() {
    const ready = AMap => {
      this.AMap = AMap
      return new Promise((resolve, reject) => {
        this.load()
          .then(() => {
            this.events = bindEvents(AMap, this.map, this.props)
            this.setState({ mount: true })
          })
          .then(resolve)
          .catch(reject)
      })
    }
    if (!process.env.AMAP_KEY) {
      throw new Error(`Not Found AMAP_KEY defined.`)
    }
    loadMap(process.env.AMAP_KEY, ['AMap.Geocoder']).then(ready).catch(err => {
      throw err
    })
  }
  componentWillUnmount() {
    Object.keys(events).forEach(key => {
      AMap.event.removeListener(events[key])
      delete events[key]
    })
    this.map.clearMap()
    this.map.clearInfoWindow()
    this.map.removeControl()
    this.map.destroy()
  }
  getChildContext() {
    return {
      AMap: this.AMap,
      map: this.map
    }
  }
  render() {
    const { width, height, children } = this.props

    return (
      <div
        ref={ref => (this.container = ref)}
        style={{ width: width + 'px', height: height + 'px' }}
      >
        {this.state.mount ? children : null}
      </div>
    )
  }
}

Map.childContextTypes = {
  AMap: PropTypes.object,
  map: PropTypes.object
}

function mapLocationToPosition(center) {
  return new Promise(function(resolve, reject) {
    if (!AMap && !AMap.Geocoder) {
      reject(new Error('Not Found AMap or AMap.Geocoder'))
    } else if (typeof center === 'string') {
      const geo = new AMap.Geocoder()
      geo.getLocation(center, function(status, response) {
        const { info, geocodes } = response
        if (status !== 'complete' || info !== 'OK' || geocodes.length === 0) {
          return resolve(undefined)
        } else {
          const [result] = geocodes
          const { location } = result
          resolve({
            position: location
          })
        }
      })
    } else {
      resolve(center)
    }
  })
}

export default Map
