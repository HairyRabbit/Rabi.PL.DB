// -*- mode: js -*-
// -*- coding: utf-8 -*-
// @flow

/**
 * app-prod
 *
 * [WIP] Build App on production mode.
 */

import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import template from 'html-webpack-template'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ManifestPlugin from 'webpack-manifest-plugin'
import ChunkManifestPlugin from 'chunk-manifest-webpack-plugin'
import WebpackChunkHash from 'webpack-chunk-hash'
import findConfigs from './../find-configs'
import foldConfigs from './../fold-configs'
import type { WebpackOptions } from './webpack-options'
import excludeDeps from './../exclude-deps'
import {
  HashedModuleIdsPlugin,
  optimize as WebpackOptimize,
  DefinePlugin,
  EnvironmentPlugin
} from 'webpack'

const CommonsChunkPlugin: CommonsChunkPlugin =
  WebpackOptimize.CommonsChunkPlugin

const distPath: string = path.resolve(__dirname, 'dist')
const srcPath: string = path.resolve(__dirname, 'src')
const configPath: string = path.resolve(__dirname, 'config')

function webpackOptions(config: Object): WebpackOptions {
  const { libs, umd } = config
  const externals: { [string]: string } = libs.reduce(foldExternals(umd), {})

  // Use unpkg CDN load libs
  const libsCdn: Array<string> = libs.map(([libName, filePath]) => {
    const url = (umd[libName] && umd[libName].url) || filePath
    return `//unpkg.com/${url}`
  })

  return {
    entry: {
      app: path.resolve(srcPath, 'boot.js')
    },
    output: {
      path: distPath,
      filename: '[name].[chunkhash].js',
      chunkFilename: '[id].[name].[chunkhash].js',
      publicPath: '/'
    },
    module: {
      rules: [
        { test: /\.js$/, use: 'babel-loader' },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            allChunks: true,
            use: ['css-loader?modules=true&importLoaders=1', 'postcss-loader']
          })
        }
      ]
    },
    externals: externals,
    plugins: [
      // Generate html page
      new HtmlWebpackPlugin({
        title: config.app.name,
        template: template,
        mobile: true,
        inject: false,
        appMountId: 'app',
        scripts: libsCdn
      }),

      // Generate stylesheet
      new ExtractTextPlugin('[name].[chunkhash].css'),

      // Define configs
      new DefinePlugin(config),

      // Caching
      new HashedModuleIdsPlugin(),
      new WebpackChunkHash(),
      new ManifestPlugin(),
      new CommonsChunkPlugin({
        name: ['app', 'manifest'],
        minChunks: Infinity
      }),
      new ChunkManifestPlugin({
        filename: 'chunk-manifest.json',
        manifestVariable: 'webpackManifest'
      })
    ]
  }
}

function mergeDeps(config: Object): Promise<Object> {
  return excludeDeps().then(libs => {
    config.libs = libs
    return config
  })
}

function foldExternals(umd: Object): Function {
  return (acc: Object, curr: [string, any, string]): { [string]: string } => {
    const [libName, _, libUmdName] = curr
    acc[libName] = (umd[libName] && umd[libName].name) || libUmdName
    return acc
  }
}

export default function makeApp(): Promise<*> {
  return findConfigs(configPath)
    .then(foldConfigs)
    .then(mergeDeps)
    .then(webpackOptions)
    .catch(err => {
      throw new Error(err)
    })
}
