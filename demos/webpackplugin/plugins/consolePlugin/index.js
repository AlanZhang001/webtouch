/**
 * webpakc 4适用
 * https://v4.webpack.docschina.org/contribute/writing-a-plugin/#%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%8F%92%E4%BB%B6
 */
const child_process = require('child_process');
// 一个 JavaScript 命名函数。
function ConsolePlugin(config) {
    this.config = config;
};

// 在插件函数的 prototype 上定义一个 `apply` 方法。
ConsolePlugin.prototype.apply = function (compiler) {
    // 指定要附加到的事件钩子函数
    compiler.hooks.emit.tapAsync( 'ConsolePlugin', (compilation, callback) => {
            // 获取到文件commitid,并写入每个文件中
            const commitID = child_process.execSync('git rev-parse  HEAD').toString().trim();
            for(var assert in compilation.assets){
                const rawSource = compilation.assets[assert];
                rawSource._value = `/*--${commitID}--*/` + rawSource._value
            }

            callback();
        }
    );
};

module.exports = ConsolePlugin;
