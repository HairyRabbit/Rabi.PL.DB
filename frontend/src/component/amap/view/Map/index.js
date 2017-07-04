// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import loadMap from '../../lib/load-map'
import loadPlugins from '../../lib/load-plugins'
import bindEvents from '../../lib/bind-events'
import type MapComponent, {
  EventMap,
  MapComponentContext
} from '../../lib/base-interface'
import style from './style.css'

type MapEvent = {
  onClick?: Function,
  onDoubleClick?: Function,
  onContextMenu?: Function,
  onMouseMove?: Function,
  onMouseWheel?: Function,
  onMouseOver?: Function,
  onMouseOut?: Function,
  onMouseUp?: Function,
  onMouseDown?: Function,
  onTouchStart?: Function,
  onTouchMove?: Function,
  onTouchEnd?: Function,
  onComplete?: Function,
  onMapMove?: Function,
  onMoveStart?: Function,
  onMoveEnd?: Function,
  onZoomChange?: Function,
  onZoomStart?: Function,
  onZoomEnd?: Function,
  onDragStart?: Function,
  onDrag?: Function,
  onDragEnd?: Function,
  onResize?: Function,
  onHotSpotClick?: Function,
  onHotSpotOver?: Function,
  onHotSpotOut?: Function
}

type Prop = {
  children?: React.Element<*>,
  center?: string | $PropertyType<AMap$MapOptions, 'center'>,
  height: number,
  width: number,
  key?: string,
  plugins?: Array<string>
} & AMap.MapOptions &
  MapEvent

type State = {
  mount: boolean
}

type LocationResult = {
  position: AMap.LngLat
}

type LocationCenter = [number, number] | LocationResult

class Map extends Component<void, Prop, State> implements MapComponent {
  // Interface
  AMap: typeof AMap
  map: AMap.Map
  events: EventMap = {}

  // Container refs
  container: HTMLElement

  // Component state
  state = {
    mount: false
  }

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
        mapLocationToPosition(
          this.AMap,
          nextProps.center
        ).then((location: ?LocationCenter) => {
          if (location) {
            const loc = Array.isArray(location) ? location : location.position
            this.map.setCenter(loc)
          }
        })
      }
    }
  }

  load(): Promise<void> {
    const { container } = this
    const { center, zoom } = this.props

    function setMap(location: ?LocationCenter): void {
      const loc = !location || Array.isArray(location)
        ? location
        : location.position
      this.map = new AMap.Map(container, {
        center: loc,
        zoom,
        mapStyle: 'amap://styles/whitesmoke'
      })
    }

    return mapLocationToPosition(this.AMap, center).then(setMap.bind(this))
  }
  componentDidMount(): void {
    function ready(AMap): Promise<void> {
      this.AMap = AMap

      function setMountAndBindEvents(): void {
        this.events = bindEvents(AMap, this.map, this.props, {
          onDoubleClick: 'dblclick',
          onContextMenu: 'rightclick',
          onDrag: 'dragging'
        })
        this.setState({ mount: true })
      }

      return this.load().then(setMountAndBindEvents.bind(this))
    }

    const { key, plugins } = this.props

    loadMap({ key, plugins }).then(ready.bind(this)).catch(err => {
      // Error Handle
      throw err
    })
  }
  componentWillUnmount(): void {
    const { events } = this

    function removeEventsHandle(key: string): void {
      AMap.event.removeListener(events[key])
      delete events[key]
    }

    Object.keys(events).forEach(removeEventsHandle)
    this.map.clearMap()
    this.map.clearInfoWindow()
    this.map.destroy()
  }
  getChildContext(): MapComponentContext {
    return {
      AMap: this.AMap,
      map: this.map
    }
  }
  render() {
    const {
      width,
      height,
      children
    }: {
      width: $PropertyType<Prop, 'width'>,
      height: $PropertyType<Prop, 'height'>,
      children: $PropertyType<Prop, 'children'>
    } = this.props

    const containerStyle: { [string]: string } = {
      ...(width ? { width: width + 'px' } : {}),
      ...(height ? { height: height + 'px' } : {})
    }

    return (
      <div
        ref={ref => (this.container = ref)}
        style={containerStyle}
        className={style.container}
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

function mapLocationToPosition(
  AMap: typeof AMap,
  center: ?([number, number] | string | AMap.LngLat)
): Promise<?LocationCenter> {
  return new Promise(function(resolve: Function, reject: Function): void {
    if (!AMap && !AMap.Geocoder) {
      throw new Error('Not Found AMap or AMap.Geocoder')
    }

    if (typeof center === 'string') {
      const cen: string = center

      loadPlugins(AMap, 'Geocoder')
        .then(function(): void {
          const geo: AMap.Geocoder = new AMap.Geocoder()

          geo.getLocation(cen, function(
            status: string,
            response: AMap.GeocodeResult
          ): void {
            const {
              info,
              geocodes
            }: { info: string, geocodes: Array<AMap.Geocode> } = response

            if (
              status !== 'complete' ||
              info !== 'OK' ||
              geocodes.length === 0
            ) {
              resolve(undefined)
            } else {
              const location: AMap.LngLat = geocodes[0].location
              resolve({
                position: location
              })
            }
          })
        })
        .catch(reject)
    } else {
      resolve(center)
    }
  })
}

export default Map
