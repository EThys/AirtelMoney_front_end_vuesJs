/* eslint-disable no-undef */
module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://213.136.74.84:800',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
