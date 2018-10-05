# export vs module.exports vs exports.md

export,module.exports,exports 这几个东西老是搞不清楚，记一下。

## 1. module.exports 和 exports

exports是module.exports的简写。

```js
exports = module.exports;
```

由此可以看出，exports不能被直接赋值，否者exports 、 module.exports两者之间的关系就断了。
exports的用法只能是
```js
exports.xxx = xxx;
```

因此，使用exports 、 module.exports导出的模块，使用的方式也有细微差别

module.exports 
```js
// 导出 a.js
function ajax(w){console.log(w)};
module.exports = ajax;

// 引入
var ajax = require('a.js');
ajax('hello');
```

exports
```
// 导出 a.js
function ajax(w){console.log(w)};
exports.ajax = ajax;
// 等同于module.export.ajax = ajax

// 引入
var ajax = require('a.js').ajax;
ajax('hello');
```

一段代码，理解一下就可以了
```js
(function webpackUniversalModuleDefinition(root, factory) {
    // 做UMD的导出处理
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define([], factory);
    else if (typeof exports === 'object')
        exports['xhr'] = factory();
    else
        root['xhr'] = factory();
})(this, function() {
    return (function(modules) { // webpackBootstrap
        // The module cache
        var installedModules = {};

        // The require function
        function __webpack_require__(moduleId) {

            // 判断installedModules是否已存在对应模块，处理一下缓存
            if (installedModules[moduleId]) {
                return installedModules[moduleId].exports;
            }
            // 创建module并做缓存处理
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: false,
                exports: {}
            };

            // modules[moduleId]是函数，执行之，让导出的方法被引用到module.exports上来（module.exports现在指向的就是导出的模块）
            // 这里的module, module.exports是各个模块中使用的module, module.exports
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

            // Flag the module as loaded
            module.l = true;

            // 返回真正导出的模块
            return module.exports;
        }

        // expose the modules object (__webpack_modules__)
        __webpack_require__.m = modules;
        // expose the module cache
        __webpack_require__.c = installedModules;
        // identity function for calling harmony imports with the correct context
        __webpack_require__.i = function(value) {
            return value;
        };
        // define getter function for harmony exports
        __webpack_require__.d = function(exports, name, getter) {
            if (!__webpack_require__.o(exports, name)) {
                Object.defineProperty(exports, name, {
                    configurable: false,
                    enumerable: true,
                    get: getter
                });
            }
        };
        // getDefaultExport function for compatibility with non-harmony modules
        __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ?
                function getDefault() {
                    return module['default'];
                } :
                function getModuleExports() {
                    return module;
                };
            __webpack_require__.d(getter, 'a', getter);
            return getter;
        };
        // Object.prototype.hasOwnProperty.call
        __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        // __webpack_public_path__
        __webpack_require__.p = '';

        // Load entry module and return exports
        // 这里，返回的就是 module.exports，而module.exports被赋值为ajax,因此这里返回的就是一个ajax方法
        return __webpack_require__(__webpack_require__.s = 0);
    })
    ([  // modules,数组，返回的是一个FUNCTION数组
        // 参数是这段代码传递过来：modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /* 0 */
        (function(module, exports, __webpack_require__) {
            'use strict';

            function ajax(argument) {
                console.log(argument);
            }

            // module是一个对象
            module.exports = ajax;

            /***/
        })
    ]);
});
```