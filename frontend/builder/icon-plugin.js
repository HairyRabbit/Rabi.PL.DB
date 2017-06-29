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

// const SVGERROR: Error = new Error(`Can't set svg`)
// const TTFERROR: Error = new Error(`Can't set ttf`)

// function svg(stream: fs.WriteStream): Function {
//   return function(options: Options): Promise<Options> {
//     return new Promise((resolve, reject) => {
//       streamToPromise(stream)
//         .then(buffer => {
//           options.svg = buffer
//           resolve(options)
//         })
//         .catch(reject)
//     })
//   }
// }

// function ttf(options: Options): Promise<Options> {
//   return new Promise((resolve, reject) => {
//     try {
//       if(options.svg) {
//         options.ttf = buffer(svg2ttf(options.svg.toString(), {}).buffer)
//         resolve(options)
//       } else {
//         reject(SVGERROR)
//       }
//     } catch (err) {
//       reject(err)
//     }
//   })
// }

// function eot(options: Options): Promise<Options> {
//   return new Promise((resolve, reject) => {
//     try {
//       if(options.ttf) {
//         options.eot = buffer(ttf2eot(uint8Arr(options.ttf)).buffer)
//         resolve(options)
//       } else {
//         reject(TTFERROR)
//       }
//     } catch (err) {
//       reject(err)
//     }
//   })
// }

// function woff(options: Options): Promise<Options> {
//   return new Promise((resolve, reject) => {
//     try {
//       if(options.ttf) {
//         options.woff = buffer(ttf2woff(uint8Arr(options.ttf)).buffer)
//         resolve(options)
//       } else {
//         reject(TTFERROR)
//       }
//     } catch (err) {
//       reject(err)
//     }
//   })
// }

// function woff2(options: Options): Promise<Options> {
//   return new Promise((resolve, reject) => {
//     try {
//       if(options.ttf) {
//         options.woff2 = buffer(ttf2woff2(options.ttf))
//         resolve(options)
//       } else {
//         reject(TTFERROR)
//       }
//     } catch (err) {
//       reject(err)
//     }
//   })
// }

type IconPluginProp = {
  outputFileName: string,
  icons: $PropertyType<Icons, 'icons'>
}

type IconProp = {
  name: string,
  path: string
}

interface Icons {
  icons: Array<IconProp>
}

class IconPlugin implements Icons {
  outputFileName: string

  icons: $PropertyType<Icons, 'icons'>

  startPoint: number = 0xe000

  stream: fs.WriteStream

  iconBuffers: {
    svg: Buffer,
    ttf: Buffer,
    eot: Buffer,
    woff: Buffer,
    woff2: Buffer
  }

  constructor(options: IconPluginProp) {
    this.outputFileName = options.outputFileName
    this.icons = options.icons
  }

  makeAssets(compilation: Object): void {
    Object.keys(this.iconBuffers).forEach(key => {
      compilation.assets[`${this.outputFileName}.${key}`] = {
        source: () => this.iconBuffers[key],
        size: () => this.iconBuffers[key].length
      }
    })
  }

  makeSvgFontStream() {
    this.stream = svgicons2svgfont({
      fontName: this.outputFileName,
      normalize: true,
      centerHorizontally: true,
      fixedWidth: false,
      fontHeight: 1000,
      fontWeight: 1000,
      log: () => {}
    })
  }

  makeSVGBuffer(cb: Function): void {
    streamToPromise(this.stream).then(buffer => {
      this.iconBuffers.svg = buffer
      this.makeTTFBuffer(cb)
    })
  }

  makeTTFBuffer(cb: Function): void {
    const buf = buffer(svg2ttf(this.iconBuffers.svg.toString(), {}).buffer)
    this.iconBuffers.ttf = buf
    this.makeEOTBuffer()
    this.makeWOFFBuffer()
    this.makeWOFF2Buffer()

    cb && cb()
  }

  makeEOTBuffer(): void {
    const buf = buffer(ttf2eot(uint8Arr(this.iconBuffers.ttf)).buffer)
    this.iconBuffers.eot = buf
  }

  makeWOFFBuffer(): void {
    const buf = buffer(ttf2woff(uint8Arr(this.iconBuffers.ttf)).buffer)
    this.iconBuffers.woff = buf
  }

  makeWOFF2Buffer(): void {
    const buf = buffer(ttf2woff2(this.iconBuffers.ttf))
    this.iconBuffers.woff2 = buf
  }

  makeCSSBuffer(): void {}

  writeToStream(cb: Function): void {
    this.icons.forEach((icon: IconProp, idx: number): void => {
      // const icon = {
      //   // FIXME directory-filename
      //   name: filename(filepath),
      //   path: path.resolve(__dirname, 'node_modules', filepath),
      //   endpoint: this.startPoiot + idx
      // }

      const glyph: any = fs.createReadStream(icon.path)

      glyph.metadata = {
        // TODO ligature supports.
        unicode: [String.fromCharCode(this.startPoint + idx)],
        name: icon.name
      }

      this.stream.write(glyph)
    })

    cb && cb()
  }

  apply(compiler: Object): void {
    this.makeSvgFontStream()

    compiler.plugin('emit', (compilation: Object, callback: Function): void => {
      this.makeSVGBuffer(() => {
        this.makeAssets(compilation)
        callback()
      })

      this.writeToStream(() => this.stream.end())
    })
  }
}

export default IconPlugin

/// HELPER

function uint8Arr(buffer: Buffer): Uint8Array {
  return new Uint8Array(buffer)
}

function buffer(buf: string): Buffer {
  return new Buffer(buf)
}

function filename(file: string): string {
  return path.basename(file, path.extname(file))
}
