const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
 transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    allowedHosts: 'all'
  }
})
module.exports = {
  configureWebpack: {
    devtool: "source-map"
  }
};