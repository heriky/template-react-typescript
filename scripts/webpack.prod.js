const path = require('path');
const webpackMerge = require('webpack-merge');
const webpack = require('webpack');

const package = require('../package.json');
const webpackBase = require('./webpack.base');
const apiDomain = require('../api-domain');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
// const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const buildOutputDir = path.join(__dirname, '../', `/${package.name}`);

module.exports = ({ mode }, ...others) =>
    webpackMerge(webpackBase({ mode }, ...others), {
        devtool: 'source-map',
        mode: mode === 'production' ? mode : 'development',
        entry: {
            app: './src/index.tsx',
            'service-worker': './service-worker.ts',
        },
        output: {
            filename: '[name]-[hash:5].min.js',
            path: buildOutputDir,
            publicPath: '/',
            libraryTarget: 'umd',
        },
        module: {},
        externals: {
            react: 'React',
            'react-dom': 'ReactDOM',
        },
        performance: {
            hints: false,
        },
        optimization: {
            minimizer: [
                new TerserWebpackPlugin({
                    cache: true,
                    parallel: true,
                    terserOptions: {
                        output: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                }),
                new OptimizeCSSAssetsPlugin({
                    assetNameRegExp: /\.min\.css$/,
                    safe: true,
                    cache: true,
                    parallel: true,
                    discardComments: {
                        removeAll: true,
                    },
                }),
            ],
        },
        plugins: [
            // new BundleAnalyzer(),
            new AntdDayjsWebpackPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    API_HOST: JSON.stringify(apiDomain[mode]),
                },
            }),

            new CleanWebpackPlugin({
                path: buildOutputDir,
            }),
            new MiniCssExtractPlugin({
                filename: '[name]-[hash:5].min.css',
                chunkFilename: '[name].css',
                allChunks: true,
            }),
        ],
    });
