// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * map-location-to-position
 *
 * Convert position to lnglat.
 *
 * Supports to use address string. Load AMap.Geocoder plugin
 * at first if not.
 */

import loadPlugins from './load-plugins'

function mapLocationToPosition(
  AMap: typeof AMap,
  center: ?([number, number] | string | AMap.LngLat)
): Promise<?([number, number] | { position: AMap.LngLat })> {
  return new Promise(function(resolve: Function, reject: Function): void {
    if (!AMap) {
      throw new Error('[AMap] Not Found AMap')
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

export default mapLocationToPosition
