// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

function loadPlugins(AMap: typeof AMap, plug: string): Promise<void> {
  return new Promise(function(resolve: Function, reject: Function): void {
    // TODO Plugins array supports Array<string>.
    if (!AMap[plug]) {
      AMap.plugin([`AMap.${plug}`], function(): void {
        if (!AMap[plug]) {
          throw new Error(`Load AMap.${plug} failed.`)
        } else {
          resolve()
        }
      })
    } else {
      resolve()
    }
  })
}

export default loadPlugins
