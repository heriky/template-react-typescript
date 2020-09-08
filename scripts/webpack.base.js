const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { description } = require('../package.json');
// const { version } = require('react/package.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const threadLoader = require('thread-loader');

const pkgDeps = require('../package.json').dependencies;
const pkgVer = Object.entries(pkgDeps).reduce((acc, [key, value]) => {
    acc[key] = value.replace(/^[^\d]?/, '');
    return acc;
}, {});

const FIVE_MINUTE = 1000 * 60 * 5;

const jsWorkerPool = {
    workers: 4,
    poolTime: FIVE_MINUTE,
};
threadLoader.warmup(jsWorkerPool, ['babel-loader']);

module.exports = ({ mode }) => ({
    resolve: {
        alias: {
            '@src': path.resolve('./src'),
            '@assets': path.resolve('./src/assets'),
            '@commons': path.resolve('./src/commons'),
            '@components': path.resolve('./src/components'),
            'cloud-react': path.resolve('./node_modules/cloud-react'), // 避免业务组件库和业务代码引用的cloud-react版本不一致问题
            '@constants': path.resolve('src/constants'),
            '@http': path.resolve('src/common/http'),
            '@utils': path.resolve('src/utils'),
            '@stores': path.resolve('./src/stores'),
            '@hooks': path.resolve('./src/hooks'),
            '@routes': path.resolve('./src/routes'),
            gojs: path.resolve('./src/assets/libs/gojs/go.js'),
        },
        modules: [path.resolve(__dirname, './src'), 'node_modules'],
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, './loaders')],
        moduleExtensions: ['-loader'],
    },
    module: {
        rules: [
            {
                test: /\.t|jsx?$/,
                use: [
                    { loader: 'thread-loader', options: jsWorkerPool },
                    'babel-loader?cacheDirectory=true',
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(c|le)ss$/,
                use: [
                    mode !== 'production' ? 'style' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: mode !== 'production',
                        },
                    },
                    'less',
                ],
                include: [
                    path.resolve(__dirname, '../src/assets'),
                    path.resolve(__dirname, '../node_modules'),
                ],
            },
            {
                test: /\.(c|le)ss$/,
                use: [
                    mode !== 'production' ? 'style' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]-[hash:base64:5]',
                            },
                            sourceMap: mode !== 'production',
                        },
                    },
                    'less',
                ],
                include: path.resolve(__dirname, '../src'),
                exclude: [path.resolve(__dirname, '../src/assets'), /node_modules/],
            },
            {
                test: /\.md$/,
                use: ['html-loader', 'md-loader'],
                include: path.resolve(__dirname, '../src'),
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url',
                options: {
                    limit: 10000,
                    name: '[name]-[hash:5].[ext]',
                },
            },
        ],
    },
    externals:
        // mode !== 'development'
        // ?
        {
            react: 'React',
            'react-dom': 'ReactDOM',
            classnames: 'classNames',
            mobx: 'mobx',
            history: 'History',
            'mobx-react': 'mobxReact',
            'mobx-react-lite': 'mobxReactlite',
            axios: 'axios',
            'react-router-dom': 'ReactRouterDOM',
            dayjs: 'dayjs',
            echarts: 'echarts',
            antd: 'antd',
            '@ant-design/icons': 'icons',
        },
    // : []
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(mode),
        }),
        new HtmlWebpackPlugin({
            env: mode,
            base: './',
            pkgVer,
            title: description,
            filename: 'index.html',
            template: './src/index.html',
            inject: false,
            minify: mode === 'production',
            favicon: path.resolve(__dirname, '../favicon.ico'),
        }),
        new webpack.ProgressPlugin(),
        new CompressionPlugin({
            // gzip压缩配置
            test: /\.js$|\.html$|\.css/, // 匹配文件名
            threshold: 10240, // 对超过10kb的数据进行压缩
            deleteOriginalAssets: false, // 是否删除原文件
        }),
    ],
});
