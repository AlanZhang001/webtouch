# 关于xhr 的一些知识点
所涉及的兼容性在IE9及以上，现代浏览器

#### 1. 跨域

- IE9在跨域的情况下，发送ajax请求需要使用XDomainRequest；但是IE10 同时支持XDomainRequest和XMLHttpRequest,因此不能更具能力检查来使用XDomainRequest；需要判断是否在IE9级是否跨域

```js
var util = {
    isIE9:/MSIE 9.0/gi.test(navigator.userAgent),
    /**
     * 请求的url是否跨域，如果域名不完全相同，则认为是跨域
     * @function
     * @param {string} requestUrl 请求url
     * @returns {boolean} 是否跨域
     */
    isCrossDomain(requestUrl){
        return /^(?:(?:https?:)?\/\/)/gi.test(requestUrl) &&
        new RegExp('(?:https?:)?\/\/' + document.domain.replace(/\./gi,'\\.') + '(/|$)','gi').test(requestUrl) === false;
    },
     * 实例化xhr对象
     * @function
     * @param {String} requestUrl 请求url
     * @return {Object} xhr对象
     */
    generateXhr(requestUrl) {
        // IE9及以下，跨域访问需要使用特别的xdomainrequest来处理
        // 此处IE10仍然支持XDomainRequest，所以不方便使用能力检测，而是使用版本检测
        let isIE9Cors = this.isCrossDomain(requestUrl) && this.isIE9;
        let xhrObject = isIE9Cors ? new XDomainRequest() : new XMLHttpRequest();
        return xhrObject;
    },
}
```

- 跨域时，安全协议源必须匹配请求的URL（http到http，https到https）。如果不匹配，请求会报“拒绝访问”的错误。
- XDomainRequest支持abort方法，但是不支持onabort回调，比较坑，需要自己手动去调用绑定的onabort方法
- XDomainRequest.ontimeout不推荐使用故对于超时设置，最好通过settimeout来处理

#### 2. 数据格式
可以通过form-data和json的方式进行数据发送。

- 对于支持通过FormData进行数据传输的浏览器，其header中默认会携带`Content-Type: multipart/form-data;`
- 对于发送数据位json格式的数据，需要设置header`Content-type:application/json`
- 对于不支持FormData的浏览器，需要将发送的数据拼接成字符串，并设置header为`Content-type:application/x-www-form-urlencoded`
- 简易的formData polyfill如下：

```js
/**
 * 如果浏览器不支持FormData则自定义FormData，最后通过toString方法转换成需要传输的数据格式
 * @function
 * @private
 * @param  {Boolean} isSupportFD [是否支持FromData]
 * @return {undefined}
 */
~function() {
    // 判断是否支持FormData，IE9及以下不支持
    let isSupportFormData = 'FormData' in window;

    if (isSupportFormData) {
        return;
    }
    window.FormData = function() {
        this.data = {};
    };

    // 标志当前对象为模拟对象而非原生
    window.FormData.prototype.isPolyfill = true;

    /**
     * [append 将key value保存在data中]
     * @param  {string} key   [添加元素名称]
     * @param  {string|number|array} value [添加元素的值，可为对象，数组，数组元素不可为复杂对象]
     * @returns {undefined}
     */
    window.FormData.prototype.append = function(key, value) {
        this.data[key + ''] = value;
    };

    /**
     * 转换data为key=value&key=value
     * @function
     * @returns {string} 形如key=value&key=value的字符串
     */
    window.FormData.prototype.toString = function() {
        return commonUtil.serializeToString(this.data);
    };
    ommonUtil 定义见:demo/commonUtil.js
}();
```

#### 3.方法的支持
除了post和get方法之外，如果需要支持其他方法如put head等，需要手动设置xhr的如下header

```js
xhr.setRequestHeader('X-Http-Method-Override','PATCH');// DELETE,PUT,HEAD
```
