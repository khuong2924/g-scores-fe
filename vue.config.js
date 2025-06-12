const { defineConfig } = require('@vue/cli-service')
const VueMacros = require('unplugin-vue-macros/webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 5173
  },
  configureWebpack: {
    plugins: [
      VueMacros({
        plugins: {
          vue: require('@vitejs/plugin-vue'),
        },
      }),
    ],
  }
})