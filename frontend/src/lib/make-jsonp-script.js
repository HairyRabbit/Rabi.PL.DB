// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * make-jsonp-script
 *
 * Configure a jsonp script loader.
 */

function makeJsonpScript(
  src: string,
  protocol?: boolean | string
): HTMLElement {
  const script: HTMLElement = document.createElement('script')
  const prot: string = protocol && typeof protocol === 'boolean'
    ? protocol ? 'https' : 'http'
    : protocol || 'http'
  const isBeginWithProtocol: boolean = /^(\w+):\/\//.test(src)
  script.type = 'text/javascript'
  script.async = true
  script.defer = true
  script.src = isBeginWithProtocol ? src : `${prot}://${src}`
  return script
}

export default makeJsonpScript
