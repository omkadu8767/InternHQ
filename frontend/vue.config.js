const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  lintOnSave: false, // Disable linting during build to avoid blocking
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
      }
    },
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, 'src')
      }
    }
  },
  devServer: {
    port: 8080,
    historyApiFallback: true, // Enable history API fallback for SPA routing
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        logLevel: 'debug'
      }
    }
  }
})
