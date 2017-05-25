module.exports = {
  plugins: [
    //require('autoprefixer')(),
    //require('postcss-custom-properties')(),
    require('postcss-short')(),
    require('postcss-nesting')(),
    require('postcss-color-function')(),
    require('postcss-easings')(),
    require('postcss-strip-inline-comments')()
  ]
}
