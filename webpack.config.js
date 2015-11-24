const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

const node_modules = path.resolve(__dirname, 'node_modules');
const appRoot = path.join(__dirname, 'public/static/');

var plugins = [
    commonsPlugin
];

var outputFilename = '[name].js';
if (process.env.production) {
    plugins.push(
        new ExtractTextPlugin('[name].[contenthash:6].css', {
            allChunks: true
        }),
        new webpack.optimize.UglifyJsPlugin({})
    );
    outputFilename = '[name].[chunkhash:6].js';
} else {
    plugins.push(
        new ExtractTextPlugin('[name].css', {
            allChunks: true
        })
    )
}

module.exports = {
    entry: {
        'login': 'js/page/login',
    },
    output: {
        path: path.join(__dirname, '/build'),
        filename: outputFilename
    },
    resolve: {
        root: appRoot,
        alias: {
            //AppStore : 'js/stores/AppStores.js'
        },
        extensions: ['','.js','.jsx', '.less', '.css']
    },
    module: {
        preLoaders: [
            { test: /\.js|jsx$/, exclude: node_modules, loader: 'eslint-loader' }
        ],
        loaders: [
            {
                test: /\.js?$/,
                exclude: [node_modules],
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.less$/, loader: 'style!css!less?sourceMap'},
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    plugins: plugins
};