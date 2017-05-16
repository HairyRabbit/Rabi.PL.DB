// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * app-dev
 *
 * [WIP] Build App on development mode.
 */

import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import template from 'html-webpack-template'
import findConfigs from './../find-configs'
import foldConfigs from './../fold-configs'
import { dllScriptPath, dllRefPlugin } from './../dll/dll-options'
import type { WebpackOptions } from './webpack-options'
import { NamedModulesPlugin, DefinePlugin, EnvironmentPlugin } from 'webpack'

const distPath: string = path.resolve(__dirname, 'dist')
const srcPath: string = path.resolve(__dirname, 'src')
const configPath: string = path.resolve(__dirname, 'config')
const dllPath: string = path.resolve(distPath, 'dll')

function webpackOptions(config): WebpackOptions {
  return {
    entry: {
      app: ['react-hot-loader/patch', path.resolve(srcPath, 'boot.js')]
    },
    output: {
      path: distPath,
      filename: '[name].js',
      chunkFilename: '[id].[name].js',
      publicPath: '/'
    },
    module: {
      rules: [
        { test: /\.js$/, use: 'babel-loader' },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader?modules=true&importLoaders=1',
            'postcss-loader'
          ]
        }
      ]
    },
    devServer: {
      host: config.server.host,
      port: config.server.port,
      contentBase: distPath,
      publicPath: '/',
      hot: true
    },
    plugins: [
      // Generate html page.
      new HtmlWebpackPlugin({
        title: config.app.name,
        template: template,
        mobile: true,
        inject: false,
        appMountId: 'app',
        scripts: [dllScriptPath('vendor'), dllScriptPath('hmr')]
      }),

      // Dll lib link
      dllRefPlugin(distPath, 'vendor'),
      dllRefPlugin(distPath, 'hmr'),

      // Webpack hot module replacement runtime need named file
      new NamedModulesPlugin(),

      // Define configs and environment
      new DefinePlugin(config),
      new EnvironmentPlugin(['NODE_ENV'])
    ]
  }
}

export default function makeApp() {
  return findConfigs(configPath)
    .then(foldConfigs)
    .then(webpackOptions)
    .catch(err => {
      throw new Error(err)
    })
}
