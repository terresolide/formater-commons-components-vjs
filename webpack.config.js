
var path = require('path')
var webpack = require('webpack')
var PACKAGE = require('./package.json');
var buildVersion = PACKAGE.version;
var buildName = PACKAGE.name;
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
var preUrl = PACKAGE.preproduction.url + "/webcomponents/";
var prodUrl = PACKAGE.production.url + buildName + "/" + buildVersion + "/dist/";

var pathsToClean = [
  'dist/*.*'
]

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: buildName+'.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        /*options: {
          loaders: {
        	  i18n: '@kazupon/vue-i18n-loader'
          }
          // other vue-loader options go here
        }*/
      },
      {
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@intlify/vue-i18n-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [ 'vue-style-loader','css-loader' ]
      },
      /* {
        test: /\.s[a|c]ss$/,
        loader: 'style!css!sass'
      }, */
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/img/[name].[hash:7].[ext]'
        }
      },
//      {
//        test: /\.(png|jpg|gif|svg)$/,
//        loader: 'file-loader',
//        options: {
//          name: '[name].[ext]?[hash]'
//        }
//      },
//      {
//    	  test: /\.(ttf|eot|woff|woff2)$/,
//    	  loader: "file-loader",
//    	  options: {
//    	    name: "fonts/[name].[ext]",
//    	  },
//    	},
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: 'assets/fonts/[name].[hash:7].[ext]'
            }
        }]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin() 
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    liveReload: true
  },
  performance: {
    hints: false
  },
  devtool: 'eval-source-map'
}
if (process.env.NODE_ENV === 'development') {
  module.exports.mode ="development"
	module.exports.output.filename='build.js'
}
if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = 'source-map';
  module.exports.output.publicPath = prodUrl;
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns:pathsToClean}),
  
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}

if (process.env.NODE_ENV === 'preproduction') {
    module.exports.devtool = '#source-map';
    module.exports.output.path =  path.resolve(__dirname, './webcomponents'),
    module.exports.output.publicPath = preUrl;
    module.exports.output.filename =   buildName+'_'+buildVersion+'.js'
    //module.exports.output.publicPath= PACKAGE.url+ buildName +'/master/dist/';

    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
     // new CleanWebpackPlugin(["webcomponents/*.*"]),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    ])
  }