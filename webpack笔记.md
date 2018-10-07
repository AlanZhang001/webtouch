## webpack 的一些个人笔记

##  一些问题

#### 1. babel-loader问题

- webpack 1.x 安装的babel-loader只能是6.x

#### 2. webpack压缩
webpack 1.x 提供的压缩插件`webpack.optimize.UglifyJsPlugin`是不能压缩ES6语法的，解决办法有2个：
- 方法1：在module中加上babel loader
- 方法2：使用新版的压缩工具：[uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin)

#### 3. gulp.task的同步异步问题
一个`gulp.task`可以执行多个任务，但是这里的任务是并行执行的，以下面的demo例，a和b之间没有先后顺序。

```js
gulp.task('demo',["a","b"]);
```

`run-sequence`插件可以让多个task顺序执行，前一个任务执行完成之后才能执行后一个问题。如：
```js
return runSequence('postcss', 'webpackdev');
```

- 如果`postcss` 无法完成，则无法继续执行`webpackdev`;
- 在进行webpack处理时，如果开启了watch，则当前任务将持续执行，不会结束，这将会导致后续的task无法进行，应该应尽量将 有watch任务的task放在最后。

#### 4. webpack接入css时，css中存在背景图，需要注意如下问题：

##### 4.1 选择正确的css，style，以及处理图片url 的loader。

```js
{
    test: /\.(?:png|jpe?g|gif)$/,
    loader: 'url',
    query:{
        limit: 10000,
        name: '[name]-[hash].[ext]'
    }
},{
    test: /\.css$/,
    exclude: './node_modules/',
    loader: 'style-loader!css-loader'
}
```

##### 4.2 正确的loader test正则

css 中背景图的使用可能加了版本号，`background-image: url("../../../images/university/i.png?v=2017");`,则对应的loader将无法处理，此时应该增强urlloader的正则方式。

```js
{
    // test: /\.(?:png|jpe?g|gif)(?:\?\s*)?$/,
    test: /\.(?:png|jpe?g|gif)(?:\?\s*)?/,
    loader: 'url',
    query:{
        limit: 10000,
        name: '[name]-[hash].[ext]'
    }
}
```

##### 4.2 output.publicPath

webpack接管css后，css中引入的背景图默认会被输出到对应output指定的目录或者gulp.dist指定的目录，页面加载时，将css注入到页面中。**对于在js中进行引用的资源(此时为背景图片资源)**，需要告诉webpack在什么目录去引入依赖的资源，此时，需要通过`output`字段进行控制

```js
output:{
    publicPath:'/scripts/dist/'
}
```
在webpack注入css至页面中时，会在图片资源的前面加上publicPath字段，以便于页面正确找到图片资源。

## 工具相关

###### 1. 分析bundle的一些工具，也是官网的推荐
- [webpack-chart](https://alexkuz.github.io/webpack-chart/): webpack 数据交互饼图
- [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/): 可视化并分析你的 bundle，检查哪些模块占用空间，哪些可能是重复使用的。
- HMR和热加载
    - [webpack-dev-server](http://www.cnblogs.com/penghuwan/p/6941616.html)
    - [webpack-dev-server官方文档，错误少，翻译的总容易带偏](https://webpack.js.org/configuration/dev-server/#devserver)

## 优化
- [Webpack 打包优化之速度篇优化](http://web.jobbole.com/92273/)


## 相关学习资料
- [一小时包教会 —— webpack 入门指南](http://www.w2bc.com/Article/50764)
- [http://gold.xitu.io/entry/57b3035f2e958a00546f8774](http://gold.xitu.io/entry/57b3035f2e958a00546f8774)
- [webpack指南](http://webpack.toobug.net/zh-cn/)
- [webpack资源合集](https://github.com/webpack-china/awesome-webpack-cn)
- [webpack中文文档](https://webpack-china.org/)
- [webpack学习笔记](http://blog.csdn.net/zhbhun/article/details/47208885)
- [LIST OF LOADERS](https://webpack.github.io/docs/list-of-loaders.html)
