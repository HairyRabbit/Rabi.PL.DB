// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * icon-plugin
 *
 * Generate icon font files.
 */

import fs from 'fs'
import path from 'path'
import glob from 'glob'
import svg2ttf from 'svg2ttf'
import ttf2eot from 'ttf2eot'
import ttf2woff from 'ttf2woff'
import ttf2woff2 from 'ttf2woff2'
import svgicons2svgfont from 'svgicons2svgfont'
import streamToPromise from 'stream-to-promise'
import mapToFilename from './map-filepath-to-modulefile'

function uint8Arr(buffer) {
  return new Uint8Array(buffer)
}

function buffer(buf) {
  return new Buffer(buf)
}

function filename(file: string): string {
  return path.basename(file, path.extname(file))
}

type SvgIconsOptions = {
  fontName: string,
  normalize: boolean,
  centerHorizontally: boolean,
  fixedWidth: boolean,
  fontHeight: number,
  fontWeight: number,
  log: Function
}

const svgIconsOptions: SvgIconsOptions = {
  fontName: 'IconFont',
  normalize: true,
  centerHorizontally: true,
  fixedWidth: false,
  fontHeight: 1000,
  fontWeight: 1000,
  log: () => {}
}

function makeMate(start) {
  return function(icon, idx) {
    return {
      name: pickname(icon),
      path: icon,
      //endpoint: `\\${(start + idx).toString(16)}`
      endpoint: start + idx
    }
  }
}

type Options = {
  svg?: Buffer,
  ttf?: Buffer,
  eot?: Buffer,
  woff?: Buffer,
  woff2?: Buffer
}

function svg(stream: Steam): Function {
  return function(options: Options): Promise<Options> {
    return new Promise((resolve, reject) => {
      streamToPromise(stream)
        .then(buffer => {
          options.svg = buffer
          resolve(options)
        })
        .catch(reject)
    })
  }
}

function ttf(options: Options): Promise<Options> {
  return new Promise((resolve, reject) => {
    try {
      options.ttf = buffer(svg2ttf(options.svg.toString(), {}).buffer)
      resolve(options)
    } catch (err) {
      reject(err)
    }
  })
}

function eot(options: Options): Promise<Options> {
  return new Promise((resolve, reject) => {
    try {
      options.eot = buffer(ttf2eot(uint8Arr(options.ttf)).buffer)
      resolve(options)
    } catch (err) {
      reject(err)
    }
  })
}

function woff(options: Options): Promise<Options> {
  return new Promise((resolve, reject) => {
    try {
      options.woff = buffer(ttf2woff(uint8Arr(options.ttf)).buffer)
      resolve(options)
    } catch (err) {
      reject(err)
    }
  })
}

function woff2(options: Options): Promise<Options> {
  return new Promise((resolve, reject) => {
    try {
      options.woff2 = buffer(ttf2woff2(options.ttf))
      resolve(options)
    } catch (err) {
      reject(err)
    }
  })
}

const stream: Stream = svgicons2svgfont(svgIconsOptions)

class IconPlugin {
  constructor(options) {
    this.outputPath = options.outputPath
    this.outputName = options.outputName
  }

  apply(compiler): void {
    const outputPath: string = this.outputPath
    const outputName: string = this.outputName
    const startPoiot: number = 0xe000
    const svgFiles: Array<string> = mapToFilename('feather/icons', '**/*.svg')
    const len: number = svgFiles.length

    compiler.plugin('emit', function(compilation, callback) {
      function output(options: Options): void {
        Object.keys(options).forEach(key => {
          console.log(key)
          const outputFileName: string = `${outputPath}/${outputName}.${key}`
          console.log(outputFileName)
          compilation.assets[outputFileName] = {
            source: function() {
              return options[key]
            },
            size: function() {
              return options[key].length
            }
          }
        })

        console.log(compilation.assets)
      }

      Promise.resolve({})
        .then(svg(stream))
        .then(ttf)
        .then(eot)
        .then(woff)
        .then(woff2)
        .then(output)
        .then(function() {
          callback()
          return null
        })

      svgFiles.forEach((filepath, idx) => {
        const icon = {
          name: filename(filepath),
          path: path.resolve(__dirname, 'node_modules', filepath),
          endpoint: startPoiot + idx
        }
        const glyph: ReadStream = fs.createReadStream(icon.path)

        glyph.metadata = {
          // TODO ligature supports.
          unicode: [String.fromCharCode(icon.endpoint)],
          name: icon.name
        }

        stream.write(glyph)
      })

      stream.end()
    })
  }
}

export default IconPlugin
