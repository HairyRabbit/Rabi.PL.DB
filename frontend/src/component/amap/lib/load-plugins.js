// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

function isPluginUnMounted(AMap: typeof AMap): Function {
  return function(plugin: string): boolean {
    return !Boolean(AMap[plugin])
  }
}

function stringifyAMapPlugin(plugin) {
  return `AMap.${plugin}`
}

function loadPlugins(
  AMap: typeof AMap,
  plugins: string | Array<string>
): Promise<void> {
  return new Promise(function(resolve: Function, reject: Function): void {
    const isUnMounted: string => boolean = isPluginUnMounted(AMap)
    const p: Array<string> = Array.isArray(plugins) ? plugins : [plugins]

    const unMountedPlugins: Array<string> = p.filter(isUnMounted)
    if (unMountedPlugins.length === 0) {
      resolve()
      return
    } else {
      AMap.plugin(unMountedPlugins.map(stringifyAMapPlugin), function(): void {
        const mountFailedPlugins: Array<string> = unMountedPlugins.filter(
          isUnMounted
        )
        if (mountFailedPlugins.length === 0) {
          resolve()
          return
        } else {
          const formatErrorString: string = mountFailedPlugins
            .map(stringifyAMapPlugin)
            .join(', ')
          const errorMsg: string = `[AMap] Load \
${mountFailedPlugins.length === 1 ? 'Plugin' : 'Plugins'} \
${formatErrorString} \
failed.`
          reject(new Error(errorMsg))
          return
        }
      })
    }
  })
}

export default loadPlugins
