/**
 * webpakc 4适用
 */

// 一个 JavaScript 命名函数。
function ConsolePlugin(config) {
    this.config = config;
};

// 在插件函数的 prototype 上定义一个 `apply` 方法。
ConsolePlugin.prototype.apply = function (compiler) {
    const that = this;
    // 指定一个挂载到 webpack 自身的事件钩子。
    compiler.plugin('ConsolePlugin', function (compilation /* 处理 webpack 内部实例的特定数据。*/, callback) {
        console.log('This is an example plugin!!!');
        console.log(JSON.stringify(that.config));

        // 现在，设置回调来访问 compilation 中的步骤：
        compilation.plugin("optimize", function() {
            console.log("Assets are being optimized.");
        });

        // 功能完成后调用 webpack 提供的回调。
        callback();
    });
};

module.exports = ConsolePlugin;
