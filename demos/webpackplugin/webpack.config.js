const path = require('path');
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

/**
 * [getEntrys 获取入口文件]
 * @param {String} buildRoot [web/web-build]
 * @return {Object} [入口名称及路径]
 */
function getEntrys() {
    var rootPath = `./scripts/`;
    var entry = {};
    var files = glob.sync(`./scripts/**/*Main.js`);

    files.forEach(function(item, index) {
        entry[item.substring(rootPath.length, item.lastIndexOf('.js'))] = item;
    });

    return entry;
}

const config = {
    entry: getEntrys(),
    plugins: [
        new ProgressBarPlugin(),
        // new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
    ],
    output: {
        path: path.resolve(__dirname, `./scripts-build/`),
        filename: '[name].js',
        chunkFilename: '[name].js?[chunkhash]',
        pathinfo: true
    }
};


module.exports = new SpeedMeasurePlugin().wrap(config);
