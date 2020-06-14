const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProposalClassProperties = require('@babel/plugin-proposal-class-properties');

module.exports = {
  mode: 'production',
  devtool: 'cheap-source-map',
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 },
  },
  entry: [
    path.resolve(__dirname, 'app/main.js'),
    path.resolve(__dirname, 'app/stylesheets/main.scss')
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: './dist.js'
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        include: path.resolve(__dirname, 'app'),
        loader: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },/*
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },*/
      {
        test: /\.js[x]?$/,
        include: [
          path.resolve(__dirname, 'app'),
          path.resolve(__dirname, 'node_modules/sn-components-api/dist/dist.js')
        ],
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ["@babel/preset-env","@babel/preset-react"]
        },
      }
    ]
  },
  externals: {
    'filesafe-js': 'filesafe-js',
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "app")
    ],
    extensions: ['.js', '.jsx', '.css', '.scss'],
    alias: {
      stylekit: path.join(
        __dirname,
        'node_modules/sn-stylekit/dist/stylekit.css'
      ),
      codemirror: path.join(
        __dirname,
        'node_modules/codemirror/'
      ),
      codemirrordialog: path.join(
        __dirname,
        'node_modules/codemirror/addon/dialog/dialog.css'
      ),
      codemirrormatchesonscrollbar: path.join(
        __dirname,
        'node_modules/codemirror/addon/search/matchesonscrollbar.css'
      )
    }
  },
  plugins: [
    new MiniCssExtractPlugin(
      {
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'dist.css',
      }
    ),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new CopyWebpackPlugin({ patterns: [
      {from: './app/index.html', to: 'index.html'}, 
      // You don't need to do this every time, only after you update dependencies
      {from: path.resolve(__dirname, './node_modules/katex/dist'), to: 'katex'},
      {from: path.resolve(__dirname, './node_modules/react/umd'), to: 'react/umd'},
      {from: path.resolve(__dirname, './node_modules/react-dom/umd'), to: 'react-dom/umd'},
    ]})
  ]
};
