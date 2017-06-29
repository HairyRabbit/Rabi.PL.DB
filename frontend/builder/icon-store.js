// -*- mode: js-jsx -*-
// -*- coding: utf-8 -*-

/**
 * icon-store
 *
 * Bundle svg icons to sprite file.
 */

const glob = require('glob')
const path = require('path')
const fs = require('fs')
const svgstore = require('svgstore')
const { promisify } = require('util')

const svgs = mapToFilename('feather/icons', '**/*.svg')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

function mapToFilename(prefix, suffix) {
  const sourcePath = path.resolve(__dirname, '../', 'node_modules', prefix)
  return glob.sync(path.resolve(sourcePath, suffix))
}

function filename(file) {
  return path
    .relative(
      path.resolve(__dirname, '../', 'node_modules', 'feather/icons'),
      file
    )
    .replace(/\\/g, '/')
    .slice(0, -4)
}

Promise.all(svgs.map(svg => readFile(svg, 'utf8')))
  .then(icons => {
    return icons.reduce(function(store, icon, idx) {
      const name = filename(svgs[idx])
      return store.add(name, icon)
    }, svgstore())
  })
  .then(store => {
    writeFile(path.resolve(__dirname, '../dist/icons.svg'), store, 'utf8')
  })
