// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

import React, { Component } from 'react'
import { geoPath, geoMercator } from 'd3-geo'
import * as topojson from 'topojson'
import style from './style.css'

type Prop = {}

function Map(props) {
  const { onSelect, width, height, children } = props
  // const json = require('map/province/shanxi1.json')
  const activedItem = children.find(n => n.active)
  const json = require('map/china.json')
  const objects = topojson.feature(json, json.objects.foo)
  const path = geoPath().projection(
    geoMercator().fitSize([width, height], objects)
  )
  const meshPath = topojson.mesh(json, json.objects.foo, function(a, b) {
    return a !== b
  })
  const mapPaths = objects.features.map((d, idx) => {
    const isActive = activedItem.value === d.properties.name
    const activedStyle = isActive
      ? [style.part, style.active].join(' ')
      : style.part
    return (
      <path
        key={idx}
        onMouseDown={() => onSelect(d.properties.name)}
        className={activedStyle}
        d={path(d)}
      />
    )
  })

  return (
    <svg width={width} height={height}>
      <g>{mapPaths}</g>
      <path className={style.mesh} d={path(meshPath)} />
    </svg>
  )
}

export default Map
