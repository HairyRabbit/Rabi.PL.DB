// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

import path from 'path'
import glob from './glob-promise'

const start = 0xe000

const svgfiles = glob.sync(`${path.resolve('feather/icons')}/**/*.svg`)

const icons = svgfiles.map((icon, idx) => {
  return {
    name: pickname(icon),
    path: icon,
    endpoint: start + idx
  }
})

function filename(file) {
  return path.basename(file, path.extname(file))
}

/**
 * makeCSS
 *
 * 创建icon对应的css
 *
 * @private
 * @param {object} icon - 字体对象
 * @return {string}
 */
function makeCSS(icon) {
  return `
.${icon.name}:before {
  content: '\\${icon.endpoint.toString(16)}'
}`
}

/**
 * loader
 *
 * loader主体
 *
 * @param {content}
 * @return {string}
 */
function loader(content) {
  // 确保只转换一次
  if (this.iconCache) return content
  this.iconBase = content
  this.iconCache = true
  return content + icons.map(makeCSS).join('\n')
}

module.exports = loader
module.exports.icons = icons
