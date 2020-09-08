const path = require('path');
const webpack = require('webpack');
const webpackBase = require('./webpack.base');
const webpackMerge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const mockUtils = require('mock-utils/utils');

const proxyConfig = require('../.proxyConfig');
const apiDomain = require('../api-domain');

// const consts = require('../src/constants/index');

const PORT = 8000;

const serverConfig = (mode, mock) => {
    if (mode !== 'development') return {};

    // development环境分为mock环境和代理环境。mock环境下需要经代理关掉，代理环境需要将mock关掉, 互斥关系。
    return {
        before: mock
            ? app =>
                  mockUtils(path.resolve(__dirname, '../mock'), app, {
                      apiPrefix: '/web-agent-monitor-api/v1',
                  })
            : null,
        proxy: mock ? {} : proxyConfig,
    };
};

module.exports = ({ mode, mock }, ...others) => {
    return webpackMerge(webpackBase({ mode }, ...others), {
        mode: mode === 'production' ? mode : 'development',
        devServer: {
            disableHostCheck: true,
            port: PORT,
            hot: true,
            inline: true,
            quiet: true,
            host: '0.0.0.0',
            contentBase: '../src',
            compress: true,
            overlay: true,
            historyApiFallback: {
                rewrites: [{ from: /^\/*$/, to: '/index.html' }],
            },
            ...serverConfig(mode, mock),
        },
        devtool: 'cheap-module-eval-source-map',
        entry: {
            app: './src/index.tsx',
            'service-worker': './service-worker.ts',
        },
        output: {
            publicPath: '/',
            filename: '[name]-[hash:5].js',
            globalObject: 'this',
        },
        bail: true,
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    API_HOST: JSON.stringify(apiDomain[mode]),
                },
            }),
            new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [
                        `Your application is running here: http://localhost:${PORT}/index.html`,
                    ],
                },
            }),
        ],
    });
};
