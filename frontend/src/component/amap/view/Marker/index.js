// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import type {
  MapComponent,
  LngLat,
  Pixel,
  Bounds,
  MapsEvent
} from '../../lib/base-interface'

type Prop = {
  position: LngLat,
  offset: Pixel,
  icon: string | Icon,
  content: string | Object,
  topWhenClick: boolean,
  bubble: boolean,
  draggable: boolean,
  raiseOnDrag: boolean,
  cursor: string,
  visible: boolean,
  zIndex: number,
  angle: number,
  autoRotation: boolean,
  animation:
    | 'AMAP_ANIMATION_NONE'
    | 'AMAP_ANIMATION_DROP'
    | 'AMAP_ANIMATION_BOUNCE',
  shadow: Icon,
  title: string,
  clickable: boolean,
  extData: any,
  label: {
    content: string,
    offset: Pixel
  }
}

class Marker extends Component implements MapComponent {
  props: Prop
  context: Context

  load() {
    const { position } = this.props
    const { AMap, map } = this.context
    this.marker = new AMap.Marker({
      position: position
    })
  }

  componentDidMount() {
    const { map } = this.context

    this.load()
    map.add(this.marker)
  }
  componentWillUnmount() {
    const { map } = this.context
    map.remove(this.marker)
  }
  render() {
    return null
  }
}

Marker.contextTypes = {
  AMap: PropTypes.object,
  map: PropTypes.object
}

export default Marker
