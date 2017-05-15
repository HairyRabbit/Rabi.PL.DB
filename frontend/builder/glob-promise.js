// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * glob-promise
 *
 * node-glob return promise.
 */

import glob from 'glob'

export default function globPromise(
  patten: string,
  options?: Object = {}
): Promise<Array<string>> {
  return new Promise(function(resolve: Function, reject: Function): void {
    glob(patten, options, function(err: any, data: any): any {
      if (err) reject(err)
      return resolve(data)
    })
  })
}
