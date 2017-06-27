// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

export interface Pixel {
  x: number,
  y: number,
  getX(): number,
  getY(): number,
  equals(point: Pixel): boolean,
  toString(): string
}

export interface Size {
  width: number,
  height: number,
  getWidth(): number,
  getHeight(): number,
  toString(): string
}

export interface LngLat {
  lng: number,
  lat: number,
  offset(w: number, s: number): LngLat,
  distance(lnglat: LngLat | Array<LngLat>): number,
  getLng(): number,
  getLat(): number,
  equals(lnglat: LngLat): boolean,
  toString(): string
}

export interface Bounds {
  southWest: LngLat,
  northEast: LngLat,
  contains(point: LngLat): boolean,
  getCenter(): LngLat,
  getSouthWest(): LngLat,
  getNorthEast(): LngLat,
  toString(): string
}

export interface MapsEvent {
  lnglat: LngLat,
  pixel: Pixel,
  type: string,
  target: Object
}

export interface HotSpotEvent {
  type: string,
  lnglat: LngLat,
  name: string,
  id: string
}

export interface MapComponent {
  map: Object,
  AMap: Object,
  load(): Object
}
