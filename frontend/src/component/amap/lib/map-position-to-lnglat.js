// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

function mapPositionToLngLat(constructor, position): LngLat {
  if (!position || !Array.isArray(position) || position.length !== 2) {
    throw new TypeError(`${String(position)} is not a Position Type.`)
  }

  const [lng, lat] = position

  return new constructor(lng, lat)
}

export default mapPositionToLngLat
