// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import loadMap from '../../lib/load-map'
import mapPositionToLngLat from '../../lib/map-position-to-lnglat'
import style from './style.css'

type MapOptions = {
  zoom: number,
  center: LngLat
}

type MapEvent =
  | 'onClick'
  | 'onDoubleClick'
  | 'onContextMenu'
  | 'onMouseMove'
  | 'onMouseWheel'
  | 'onMouseOver'
  | 'onMouseOut'
  | 'onMouseUp'
  | 'onMouseDown'
  | 'onTouchStart'
  | 'onTouchMove'
  | 'onTouchEnd'
  | 'onComplete'
  | 'onMapMove'
  | 'onMoveStart'
  | 'onMoveEnd'
  | 'onZoomChange'
  | 'onZoomStart'
  | 'onZoomEnd'
  | 'onDragStart'
  | 'onDrag'
  | 'onDragEnd'
  | 'onResize'
  | 'onHotSpotClick'
  | 'onHotSpotOver'
  | 'onHotSpotOut'

const MapEventList: Array<MapEvent> = [
  'onClick',
  'onDoubleClick',
  'onContextMenu',
  'onMouseMove',
  'onMouseWheel',
  'onMouseOver',
  'onMouseOut',
  'onMouseUp',
  'onMouseDown',
  'onTouchStart',
  'onTouchMove',
  'onTouchEnd',
  'onComplete',
  'onMapMove',
  'onMoveStart',
  'onMoveEnd',
  'onZoomChange',
  'onZoomStart',
  'onZoomEnd',
  'onDragStart',
  'onDrag',
  'onDragEnd',
  'onResize',
  'onHotSpotClick',
  'onHotSpotOver',
  'onHotSpotOut'
]

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

type Prop = MapOptions | MapEvent

const ValidMapOptions = {
  zoom: true,
  center: true
}

const ValidMapEvent = {
  onClick: true,
  onDoubleClick: true,
  onContextMenu: true,
  onMouseMove: true,
  onMouseWheel: true,
  onMouseOver: true,
  onMouseOut: true,
  onMouseUp: true,
  onMouseDown: true,
  onTouchStart: true,
  onTouchMove: true,
  onTouchEnd: true,
  onComplete: true,
  onMapMove: true,
  onMoveStart: true,
  onMoveEnd: true,
  onZoomChange: true,
  onZoomStart: true,
  onZoomEnd: true,
  onDragStart: true,
  onDrag: true,
  onDragEnd: true,
  onResize: true,
  onHotSpotClick: true,
  onHotSpotOver: true,
  onHotSpotOut: true
}

class Map extends Component {
  constructor(props: Prop) {
    super(props)
    this.state = { mount: false }
    this.events = []
    this.AMap = this.map = null
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.zoom !== this.props.zoom) {
      this.map.setZoom(nextProps.zoom)
    }

    if (nextProps.center !== this.props.center) {
      if (typeof nextProps.center !== 'string') {
        this.map.setCenter(nextProps.center)
      } else {
        this.map.setCity(nextProps.center)
      }
    }
  }
  componentDidMount() {
    loadMap('417f3e40ffc0d21033841526e3116387')
      .then(AMap => {
        let options = {}
        let events = []

        Object.keys(this.props).forEach(key => {
          if (ValidMapOptions[key]) {
            options[key] = this.props[key]
          }

          if (ValidMapEvent[key]) {
            events.push(key)
          }
        })

        const map = new AMap.Map(this.container, {
          ...options,
          mapStyle: 'amap://styles/whitesmoke'
        })

        events.forEach(key => {
          const evt = AMap.event.addListener(
            map,
            mapToMapEvent(key),
            this.props[key]
          )
          this.events.push(evt)
        })

        this.AMap = AMap
        this.map = map
        this.setState({ mount: true })
      })
      .catch(err => {
        throw err
      })
  }
  componentWillUnmount() {
    this.events.forEach(evt => {
      AMap.event.removeListener(evt)
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

export default Map
