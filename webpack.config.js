const fs = require('fs');
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const node_modules = path.resolve(__dirname, 'node_modules');
const appRoot = path.join(__dirname, 'public/static/');
/**
 * 自动查找目录生成entry
 */
function getEntry() {
    var jsDir = path.join(appRoot, 'js/page');
    var files = {};
    glob.sync(jsDir + '/**/*.js').forEach((file, index) => {
        var name = file.replace(jsDir, '').substring(1);
        var matchs = name.match(/(.+)\.js$/);
        files[matchs[1]] = file;
    });
    return files;
}

function chunkList(){
    this.plugin('done', function(stats) {
        // 获取文件列表
        var filemaps = stats.toJson();
        var filemapsStr = JSON.stringify(filemaps.assetsByChunkName);
        // 生成编译文件的maps
        fs.writeFileSync(path.join(__dirname, 'filemaps.json'), filemapsStr);
    });
}

var plugins = [
    chunkList
];

var outputFilename = '[name].js';
if (process.env.production) {
    plugins.push(
        new webpack.optimize.CommonsChunkPlugin('common.[chunkhash:6].js'),
        new ExtractTextPlugin('[name].[contenthash:6].css', {
            allChunks: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );
    outputFilename = '[name].[chunkhash:6].js';
} else {
    plugins.push(
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        new ExtractTextPlugin('[name].css', {
            allChunks: true
        })
    )
}

module.exports = {
    entry: getEntry(),
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
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(
                    'css?sourceMap!' +
                    'less?sourceMap'
                )
            },
            { test: /\.(png|jpe?g|gif)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    plugins: plugins
};