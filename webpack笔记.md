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

#### 5. js中引用.css文件，压缩后-webkit-,-moz-等前缀消失的问题

问题出现的情况是这样：

(1). js中引用css文件，通过webpack的loader处理后，页面加载css的时候会注入到页面中来：

```javascirpt
require('a.css');
```

(2). css的内容因为用到了不太兼容的属性，所以加了浏览器前缀：
```css
.list li{
    width: 1%;
    -moz-box-flex: 1;
    -webkit-box-flex: 1;
    box-flex: 1;
    text-align: center;
    color: #121313;
}
```

(3). 使用webpack1.x 做打包压缩
```javascript
{
    module: {
        loaders: [{
            test: /\.html$/,
            loader: 'text'
        }, {
            test: /\.css$/,
            exclude: "./node_modules",
            loader: 'style-loader!css-loader'
        }, {
            test: /\.js?$/,
            exclude: "./node_modules",
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                drop_console: true,
                warnings:false
            }
        }),
    ]
}
```

(4). 加入到浏览中的css结果是这样,加入的浏览器前缀头部被去掉了

```css
.list li{
    width: 1%;
    box-flex: 1;
    text-align: center;
    color: #121313;
}
```

**问题分析：**

- webpack.optimize.UglifyJsPlugin 处理压缩的时候，默认是开启minimize的
- 在css-loader 处理css的时候，webpack会默认给css-loader压缩的参数
- css-loader会使用cssnano进行压缩，而cssnano会使用到autoprefixer进行无关前缀的清理,最终导致css的前缀丢失

**解决办法：**

方法1：loader中去掉autoprefixer的处理
```
{
    test: /\.css$/,
    exclude: "./node_modules",
    loader: 'style-loader!css-loader?minimize&-autoprefixer'
}
```

方法2：直接换成webpack2及uglifyjs-webpack-plugin做打包压缩

#### 6. 打包后的文件在严格模式下报错的问题

es 模块通过import export 导入导出，通过babel做降级打包时，默认会在模块最前加上 'use strict',如果模块中引用或是用了 非严格模式才能使用的语法，比如argument.callee,argument.caller,这会导致报错。在babel的配置中加上`"sourceType": "script"`即可

.babelrc
```js
{
    "presets": [
    	...
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "debug": false,
                "modules": "commonjs",
                "corejs": "2"
            }
        ]
    ],
    "plugins": [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-transform-runtime" 
	...
    ],
    // files are not in strict mode
    "sourceType": "script"
}
```


#### 7. loader的问题

从 webpack 2 开始，loader的配置需要使用全名，例如 example-loader。然而，如果你确实想省略 -loader，也就是说只使用 example，则可以使用此选项来实现：

webpack.config.js
```js
//  配置loader后缀
module.exports = {
  //...
  resolveLoader: {
    moduleExtensions: ['-loader']
  }
};

// 或者配置loader 的alias
resolveLoader: {
    alias: {
	'text': 'text-loader'
    }
},
```

#### 8. vue-loader 的锅

webpack3 对饮的vue-loader如果是 14.x，如果需要对vue文件中的代码做babel处理，要单独对vue-loader做babel的配置。

```js
 {
	test: /\.vue$/,
	include: [
	    path.resolve(__dirname,'web/scripts/app'),
	    path.resolve(__dirname,'node_modules/@futuweb')
	],
	loader: 'vue-loader',
	options: {
	    loaders: {
		js: [{
		    loader:'babel-loader',
		    options:{
		    	// babel配置可以直接写在这里
		    }
		}]
	    }
	}
}
```

同时，babel的配置需要以babel.config.js 的方式存在。或者直接写在webpack的options参数中

babel.config.js
```js
module.exports = function (api) {
    api.cache(true);
    return {
        "presets": [
            [
                "@babel/preset-env",
                {
                    "targets": {
                        "browsers": "ie >= 9"
                    } 
                }
            ],
        ],
    
        "plugins": [
            ["@babel/plugin-proposal-object-rest-spread", { "loose": true, "useBuiltIns": true }],
            "@babel/plugin-syntax-dynamic-import"
        ]
    };
};
```



## 背诵并默写全文的版本关系

- webpack 3-
	- 不需要webpack-cli
	- vue-loader 14-
	- 不需要VueLoaderPlugin
	- 使用ExtractTextPlugin

- webpack 4+
	- 需要webpack-cli
	- vue-loader 15+
	- 需要VueLoadderPlugin，需要指定extractCss:true
	- 使用MiniCssExtractPlugin


Babel 6- 独立的模块，对应的babel-loader是7.x

Babel 7+ 全部收归到@babel namespace下，对应的babel-loader是8.x



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
