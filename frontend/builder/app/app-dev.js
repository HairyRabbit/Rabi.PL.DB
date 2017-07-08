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
import bodyParser from 'body-parser'
import findConfigs from '../find-configs'
import foldConfigs from '../fold-configs'
import mapRuntimeConfig from '../map-runtime-config'
import { dllScriptPath, dllRefPlugin } from '../dll/dll-options'
import type { WebpackOptions } from './webpack-options'
import IconHtmlPlugin from '../icon-html-plugin'
import { NamedModulesPlugin, DefinePlugin, EnvironmentPlugin } from 'webpack'

const distPath: string = path.resolve(__dirname, 'dist')
const srcPath: string = path.resolve(__dirname, 'src')
const configPath: string = path.resolve(__dirname, 'config')
const dataPath: string = path.resolve(__dirname, 'data')
const publicPath: string = path.resolve(__dirname, 'public')
const dllPath: string = path.resolve(distPath, 'dll')
const libPath: string = path.resolve(srcPath, 'lib')
const libStylePath: string = path.resolve(libPath, 'styles')
const viewPath: string = path.resolve(srcPath, 'view')
const componentPath: string = path.resolve(srcPath, 'component')
const corePath: string = path.resolve(srcPath, 'core')
const iconPath: string = 'feather/icons'
const imagePath: string = path.resolve(publicPath, 'images')
const mapPath: string = path.resolve(dataPath, 'maps')

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
        {
          test: /\.js$/,
          use: ['cache-loader', 'thread-loader?workers=4', 'babel-loader']
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader?modules=true&importLoaders=1&sourceMap',
            'postcss-loader?sourceMap'
          ]
        },
        {
          test: /map[^.]+\.json$/,
          use: ['json-loader', './builder/echarts-topojson-loader.js']
        },
        {
          test: /icon[^.]+\.svg$/,
          use: ['babel-loader', 'react-svg-loader']
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: ['url-loader?limit=5000']
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          use: ['url-loader?limit=0']
        }
      ]
    },
    resolve: {
      alias: {
        lib: libPath,
        style: libStylePath,
        view: viewPath,
        component: componentPath,
        core: corePath,
        icon: iconPath,
        data: dataPath,
        map: mapPath,
        image: imagePath
      }
    },
    devServer: {
      host: config.server.host,
      port: config.server.port,
      contentBase: distPath,
      publicPath: '/',
      hot: true,
      proxy: {
        '/live/comment': {
          bypass: function(req, res) {
            console.log(req.body)
            res.sendStatus(200)
            return false
          }
        }
      },
      setup(app) {
        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json())
      }
    },
    plugins: [
      // Generate html page.
      new HtmlWebpackPlugin({
        title: config.app.name,
        template: template,
        mobile: true,
        inject: false,
        appMountId: 'app',
        scripts: [
          dllScriptPath('vendor'),
          dllScriptPath('hmr'),
          dllScriptPath('icon')
        ]
      }),
      //new IconHtmlPlugin(),

      // Dll lib link
      dllRefPlugin(distPath, 'vendor'),
      dllRefPlugin(distPath, 'hmr'),
      dllRefPlugin(distPath, 'icon'),

      // Webpack hot module replacement runtime need named file
      new NamedModulesPlugin(),

      // Define configs and environment
      new DefinePlugin(mapRuntimeConfig(config)),
      new EnvironmentPlugin(['NODE_ENV'])
    ]
  }
}

export default function makeApp() {
  return findConfigs(configPath)
    .then(foldConfigs)
    .then(webpackOptions)
    .catch(err => {
      throw err
    })
}
