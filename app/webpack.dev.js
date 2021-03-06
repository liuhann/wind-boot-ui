const merge = require('webpack-merge'),
    common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval',
    devServer: {
        contentBase: './dist'
    }
});
