var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');


// add all the dependencies here that don't get updated often
const VENDOR_CODE = [
  'faker', 'lodash', 'react', 'react-redux'
];

const config = {
  // the first file loaded by webpack
  // defined relatively to where this file is (generally the source of the app)
  // entry: './src/index.js',
  // to code-split between custom code and vendor code, use an object
  entry: {
    bundle: './src/index.js', // to webpack, this means create a file called bundle.js using the given file as the first file
    vendor: VENDOR_CODE // and create a file called vendor.js with all the files/libraries that match the given array
  },

  // where webpack should output its bundle
  // this needs to be defined using an absolute path
  output: {
    // use node's path module and __dirname to easily find that path
    path: path.resolve(__dirname, 'build'),

    // the name that webpack should use for its exported JS -- generally bundle.js
    // filename: 'bundle.js',
    // if you have different entry points, use this syntax to name the output files based on their keys
    // filename: '[name].js',
    // to tell webpack to add a hash, use this:
    // the hash will change each time the file is updated (when a new version is built)
    // and the browser will be able to load a new version instead of using the cached one
    filename: '[name].[chunkHash].js',

    // tells the server where to load bundle from
    // url-loader and file-loader also prepend this value to relevant import files of referenced loaded files
    publicPath: 'build/'
  },

  // where loaders are defined
  // in webpack 2, we call these 'rules', before they were called 'loaders'
  module: {
    rules: [
      {
        // what to do:
        // this will run babel on all files with a .js extension
        // babel will go to the .babelrc file to figure out which config it needs to run
        use: 'babel-loader',
        // where to do it (using regex):
        test: /\.js$/
      },
      {
        // you can pass in files through several loaders by adding loaders to an array
        // note that the loaders will be applied from right to left
        // here, the css files will be fed to css-loader and the output
        // of that will be fed to style-loader
        // use: ['style-loader', 'css-loader'],
        // test: /\.css$/

        // to merge all css into one file, use this plugin:
        // here loader is the old terminology -- it's needed when using plugins
        loader: ExtractTextPlugin.extract({
          loader: 'css-loader'
        }),
        test: /\.css$/
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          // 'url-loader'
          // if you want to add specific options to a loader (here: behave differently based on image size, add it as an object and specify options)
          {
            loader: 'url-loader',
            options: { limit: 40000 } // if image is smaller than 40000KB, include it in bundle.js, otherwise save it as its own file
          },
          'image-webpack-loader' // remember that order matters -- this is applied first
        ],
      }
    ]
  },

  plugins: [
    // tells the ExtractTextPlugin to take any files matched in its loader
    // and save them in a file called style.css
    new ExtractTextPlugin('style.css'),

    // tells webpack to put any code that it finds in bundle that it was told to put in vendor only in vendor
    new webpack.optimize.CommonsChunkPlugin({
      // without chunk hashing:
      // name: 'vendor'

      // to enable chunk hashing, use:
      // manifest is a third file that helps tell the browser whether the vendor file has been udpated or not
      names: ['vendor', 'manifest']
    }),

    // adds <script> with src to different webpack outputs to include them in our html
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),

    // DefinePlugin defines window-scope variables in the output file
    // changes React's behavior based on env variable
    // for eg. less error checking on 'production'
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': json.stringify(process.end.NODE_ENV)
    })
  ]
};

module.exports = config;
