// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import type { MapComponent } from '../../lib/base-interface'
import loadMap from '../../lib/load-map'
import bindEvents from '../../lib/bind-events'
import style from './style.css'

type Prop = {
  zoom: $PropertyType<AMap$MapOptions, 'zoom'>,
  center: $PropertyType<AMap$MapOptions, 'center'>
}

type State = {
  mount: boolean
}

class Map extends Component<void, Prop, State> implements MapComponent {
  AMap: AMap
  map: AMap$Map
  events: { [string]: AMap$EventListener } = []
  container: HTMLElement
  state = { mount: false }

  checkInfoWindow() {
    // TODO
  }

  componentWillReceiveProps(nextProps: Prop): void {
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

  load(): Promise<*> {
    const { container } = this
    const { center, zoom } = this.props

    return new Promise(
      function(resolve, reject) {
        mapLocationToPosition(center)
          .then(location => {
            this.map = new AMap.Map(container, {
              center: location && location.position,
              zoom,
              mapStyle: 'amap://styles/whitesmoke'
            })
          })
          .then(resolve)
          .catch(reject)
      }.bind(this)
    )
  }
  componentDidMount(): void {
    function ready(AMap) {
      this.AMap = AMap

      function bindEventPromise(resolve, reject) {
        this.load()
          .then(() => {
            this.events = bindEvents(AMap, this.map, this.props)
            this.setState({ mount: true })
          })
          .then(resolve)
          .catch(reject)
      }

      return new Promise(bindEventPromise.bind(this))
    }

    loadMap({ plugins: ['AMap.Geocoder'] })
      .then(ready.bind(this))
      .catch(err => {
        // Error Handle
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
