const HtmlWebpackPlugin = require('html-webpack-plugin'),
    path = require('path');

module.exports = {
    entry: './app/index.js',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../public')
    },
    module: {
        rules: [{
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.(js|jsx)$/,
            exclude: /node_modules\/(?!(@gw)$\/).*/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [['@babel/preset-env', {
                        targets: {
                            browsers: [
                                'last 1 chrome version',
                                'last 1 firefox version',
                                'last 1 safari version'
                            ]
                        }
                    }], '@babel/preset-react'],
                    plugins: ['@babel/plugin-proposal-class-properties']
                }
            }
        }, {
            test: /\.s[ac]ss$/i,
            use: [{
                loader: 'style-loader' // 将 JS 字符串生成为 style 节点
            }, {
                loader: 'css-loader' //  将 CSS 转化成 CommonJS 模块
            }, {
                loader: 'sass-loader' // 将 Sass 编译成 CSS
            }]
        }, {
            test: /\.less$/,
            use: [
                {
                    loader: 'style-loader' // creates style nodes from JS strings
                },
                {
                    loader: 'css-loader' // translates CSS into CommonJS
                },
                {
                    loader: 'less-loader' // compiles Less to CSS
                }
            ]
        }, {
            test: /\.(png|jpg|gif)$/i,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192
                }
            }]
        }, {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                'file-loader'
            ]
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: '@svgr/webpack',
                options: {
                    icon: true
                }
            }, {
                loader: 'url-loader',
                options: {
                    limit: 8192
                }
            }]
        }]
    },
    optimization: {
        usedExports: true,
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [new HtmlWebpackPlugin({
        title: 'Output Management',
        template: 'app/index.html'
    })]
};
