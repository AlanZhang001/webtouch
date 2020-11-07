const path = require('path');
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const ConsolePlugin = require('./plugins/consolePlugin')
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

module.exports = (env,argv) => {
    const isProdEnv = env && env.prod;
    const entry = getEntrys();
    const config = {
        mode: isProdEnv ? 'production' : 'development',
        entry: entry,
        plugins: [
            new ProgressBarPlugin(),
            // new VueLoaderPlugin(),
            new CleanWebpackPlugin(),
            new ConsolePlugin({
                entry: entry
            })
        ],
        output: {
            path: path.resolve(__dirname, `./scripts-build/`),
            filename: '[name].js',
            chunkFilename: '[name].js?[chunkhash]'
        }
    };
    new SpeedMeasurePlugin().wrap(config);
    return config;
};
