import svgstore from 'svgstore'

class IconStorePlugin {
  constructor() {}
  apply(compiler) {
    compiler.plugin('compilation', function(compilation) {
      compilation.plugin('html-webpack-plugin-before-html-processing', function(
        data,
        callback
      ) {
        console.log(data)
        callback(null, data)
      })
    })
  }
}

export default IconStorePlugin
