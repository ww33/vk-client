// publicPath: process.env.NODE_ENV === 'production' ? '/vue-chat/' : '/',
module.exports = {
  devServer: {
    https: true,
    port: 443,
    public: "0.0.0.0",
    compress: true,
    disableHostCheck: true,
    proxy: {
      "/upload.php": {
        target: "https://api.myqu.inachi.eu/upload.php",
        changeOrigin: true,
        onProxyReq: function(request, req, res) {
          request.setHeader("origin", "https://api.myqu.inachi.eu/");
        }
      }
    }
  },

  productionSourceMap: true,
  /*productionSourceMap: process.env.NODE_ENV !== 'production',*/

  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/_main.scss";`
      }
    }
  }

  /*
    postcss: {
      config: {
        path: path.resolve('./assets/')
      }
    }
  */
};
