## webpack 的一些个人笔记

##  一些问题

#### 1. babel-loader问题

- webpack 1.x 安装的babel-loader只能是6.x

#### 2. webpack压缩
webpack 1.x 提供的压缩插件`webpack.optimize.UglifyJsPlugin`是不能压缩ES6语法的，解决办法有2个：
- 方法1：在module中加上babel loader
- 方法2：使用新版的压缩工具：[uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin)

## 工具相关

###### 1. 分析bundle的一些工具，也是官网的推荐
- [webpack-chart](https://alexkuz.github.io/webpack-chart/): webpack 数据交互饼图
- [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/): 可视化并分析你的 bundle，检查哪些模块占用空间，哪些可能是重复使用的。

## 优化
- [Webpack 打包优化之速度篇优化](http://web.jobbole.com/92273/)