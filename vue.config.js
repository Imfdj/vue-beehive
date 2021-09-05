const path = require('path');
const {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  title,
  devPort,
  providePlugin,
  build7z,
} = require('./src/config/settings');
const { version, author } = require('./package.json');
const Webpack = require('webpack');
const WebpackBar = require('webpackbar');
const dayjs = require('dayjs');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const date = new dayjs().format('YYYY_M_D');
const time = new dayjs().format('YYYY-M-D HH:mm:ss');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['html', 'js', 'css', 'svg'];
process.env.VUE_APP_TITLE = title || 'vue-beehive';
process.env.VUE_APP_AUTHOR = author || 'Imfdj';
process.env.VUE_APP_UPDATE_TIME = time;
process.env.VUE_APP_VERSION = version;
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  devServer: {
    hot: true,
    port: devPort,
    open: true,
    noInfo: false,
    overlay: {
      warnings: true,
      errors: true,
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7001',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          // '^/api': ''
        },
      },
      '/public/upload': {
        target: 'http://127.0.0.1:7001',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          // '^/remote_public': '',
        },
      },
      '/socket.io': {
        target: 'http://127.0.0.1:7001',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          // '^/remote_public': '',
        },
      },
    },
  },
  configureWebpack() {
    return {
      resolve: {
        alias: {
          '@': resolve('src'),
          '^': resolve('src/components'),
        },
      },
      externals:
        process.env.NODE_ENV === 'production'
          ? {
              vue: 'Vue',
              'vue-router': 'VueRouter',
              axios: 'axios',
              'element-ui': 'ELEMENT',
              vuex: 'Vuex',
            }
          : {},
      plugins: [new Webpack.ProvidePlugin(providePlugin)],
    };
  },
  chainWebpack(config) {
    /* config.plugins.delete("preload");
    config.plugins.delete("prefetch"); */
    config.module.rule('svg').exclude.add(resolve('src/remixIcon')).add(resolve('src/colorfulIcon')).end();
    config.module
      .rule('remixIcon')
      .test(/\.svg$/)
      .include.add(resolve('src/remixIcon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'remix-icon-[name]' })
      .end();
    config.module
      .rule('colorfulIcon')
      .test(/\.svg$/)
      .include.add(resolve('src/colorfulIcon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'colorful-icon-[name]' })
      .end();
    config.when(process.env.NODE_ENV === 'development', config => {
      config.devtool('source-map');
    });
    config.when(process.env.NODE_ENV !== 'development', config => {
      config.performance.set('hints', false);
      config.devtool('none');
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial',
          },
          elementUI: {
            name: 'chunk-elementUI',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
          },
          fortawesome: {
            name: 'chunk-fortawesome',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?@fortawesome(.*)/,
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      config
        .plugin('compression')
        .use(CompressionWebpackPlugin, [
          {
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
            threshold: 8192,
            minRatio: 0.8,
          },
        ])
        .end();
      config.module
        .rule('images')
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          bypassOnDebug: true,
        })
        .end();
    });
    config.when(
      process.env.NODE_ENV === 'production',
      config => {
        config.plugin('html').tap(args => {
          args[0].cdn = {
            css: ['https://cdn.jsdelivr.net/npm/element-ui@2.14.1/lib/theme-chalk/index.css'],
            js: [
              // vue must at first!
              'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js',
              'https://cdn.jsdelivr.net/npm/vuex@3.6.0/dist/vuex.min.js',
              'https://cdn.jsdelivr.net/npm/vue-router@3.4.9/dist/vue-router.min.js',
              'https://cdn.jsdelivr.net/npm/element-ui@2.14.1/lib/index.js',
              'https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js',
            ],
          };
          return args;
        });
      },
      config => {
        config.plugin('html').tap(args => {
          args[0].cdn = {
            css: [],
            js: [],
          };
          return args;
        });
      }
    );
    if (build7z) {
      config.when(process.env.NODE_ENV === 'production', config => {
        config
          .plugin('fileManager')
          .use(FileManagerPlugin, [
            {
              onEnd: {
                delete: [`./${outputDir}/video`, `./${outputDir}/data`],
                archive: [
                  {
                    source: `./${outputDir}`,
                    destination: `./${outputDir}/${title}_${outputDir}_${date}.7z`,
                  },
                ],
              },
            },
          ])
          .end();
      });
    }
  },
  runtimeCompiler: true,
  productionSourceMap: false,
  css: {
    requireModuleExtension: true,
    sourceMap: true,
    loaderOptions: {
      scss: {
        /*sass-loader 8.0语法 */
        //prependData: '@import "~@/styles/variables.scss";',

        /*sass-loader 9.0写法，感谢github用户 shaonialife*/
        additionalData(content, loaderContext) {
          const { resourcePath, rootContext } = loaderContext;
          const relativePath = path.relative(rootContext, resourcePath);
          if (relativePath.replace(/\\/g, '/') !== 'src/styles/variables.scss') {
            return '@import "~@/styles/variables.scss";' + content;
          }
          return content;
        },
      },
    },
  },
};
