// -*- mode: js -*-
// -*- coding: utf-8 -*-

/**
 * node-externals-plugin
 *
 * Configure for nodejs platform.
 */

const ExternalsPlugin = require('webpack/lib/ExternalsPlugin')
const nodeExternals = require('webpack-node-externals')

class NodeExternalsPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.plugin('after-plugins', cmp => {
      cmp.apply(new ExternalsPlugin('commonjs', nodeExternals(this.options)))
    })
    compiler.plugin('after-environment', function() {
      this.options.node = false
      // this.options.node.__dirname = false
      // this.options.node.__filename = false
      // this.options.node.process = false
    })
  }
}

module.exports = NodeExternalsPlugin
