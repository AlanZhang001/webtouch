
## 安全问题

#### WEB前端
######  xss
- 定义：
    - 反射性：代码不会储存。类似`https://www.weibo?t=${xss的代码}`的链接，当t的值被当做html片段插入文档中xss代码即被执行
    - 存储性：在提交表单数据时，xss代码被保存在数据库，下次在页面上直接输出该部分内容展示时被执行
- 危害：
    - 获取cookie等敏感信息并传输出去
    - 在当前页面加入恶意代码或者直接加载一个外部js，这样可以做很多事情
- 解决办法：
    - 防止被偷cookie：httponly
    - 对于反射性的漏洞，Chrome已经对参数进行过滤了,防止XSS攻击(其实就是内置X-XSS-Protection)
    - 添加响应头：X-XSS-Protection(只可以防御反射型)
        - 开启这个功能后，当浏览器检测到跨站脚本攻击（XSS）时，浏览器将对页面做清理或直接阻止整个页面的加载。
        - IE、Chrome 和 Safari 都内置了这个模块。edge 和火狐没有内置这个模块。
        - 在 IE 上它叫 XSS Filter，在 Chrome 上它叫 XSS Auditor（不过[chrome准备弃用XSS Auditor](https://linux.cn/article-11112-1.html)）。
        - 可以为尚不支持 CSP 的旧版浏览器的用户提供保护
        - 几个用法：
            - X-XSS-Protection : 0，禁用 XSS 过滤这个功能
            - X-XSS-Protection : 1，启用 XSS 过滤，一般浏览器中都是默认开启。如果检测到跨站脚本攻击，浏览器将清除在页面上检测到的不安全的部分
            - X-XSS-Protection : 1; mode=block，如果检测到攻击，浏览器不会像上面的选项一样将不安全的部分删除，而是直接阻止整个页面的加载
            - X-XSS-Protection : 1; report=<reporting-uri>，如果检测到跨站脚本攻击，浏览器会清除在页面上检测到的不安全的部分，并使用report-uri的功能 POST 一个 XSS 警报。这个功能只有在 Chrome 中有效果，在 IE 中无效。
    - csp：控制浏览器能够为指定的页面加载哪些资源
        - 浏览器支持性还可以，IE 6-9，12-13 不支持
        - [配置略复杂](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy)，看几个例子
            - Content-Security-Policy: default-src https:禁用不安全的内联/动态执行, 只允许通过 https加载这些资源 (images, fonts, scripts, etc.)
            - Content-Security-Policy: default-src 'self': 要所有内容均来自站点的同一个源 (不包括其子域名)
            - Content-Security-Policy: default-src 'self' *.futunn.com:允许内容来自信任的域名及其子域名 (域名不必须与CSP设置所在的域名相同)
            - 更多[示例](https://infosec.mozilla.org/guidelines/web_security#examples-4)
    - 特殊字符输出时转义（因为内容可能在多终端显示，所以建议在后端输出时转义而不是输入时）
        - < 转成 &lt; > 转成 &gt; & 转成 &amp; " 转成 &quot; ' 转成 &#39
        - ? 这里需要搞明白，转义 和 escap 和 encodeURI 、encodeURIComponent的区别

- csrf
- cdn劫持

###### a标签跳转时 opener.location.href劫持
- 定义：当带有target="_blank"的a标签打开的新标签页面，在新标签页中可以通过`window.opener.location.href = 'https://www.hack.com'`能将原页面跳转到恶意页面
- 解决办法：
    - 1. 在 <a> 标签的 rel 属性中指定 rel="noopener",这种方法IE上基本不支持
    - 2. 在 <a> 标签的 rel 属性中指定 rel="noreferrer",这种方法IE10及以下不支持，同时设置noreferrer，也会导致新页面无法通过document.referrer 获取到源信息。为了解决
    这个劫持漏洞，一般会同时设置rel="noreferrer noopener"。
    - 3. 如果需要照顾老旧浏览器，可以通过js打开页面：`var newTab = window.open(); newTab.opener = null; newTab.location = targetUrl`
- 延伸：rel="noopener" 对性能优化的帮助
    - 官方文档在介绍[a标签的target属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a)时表明，通过 target="_blank"打开新页面时，会在原页面所在的进程中打开新页面，如果新页面在执行耗时js，原页面的性能会受到影响。
    - 通过设置rel="noopener"，可以避免这种性能问题。
    - 原文：`Linking to another page using target="_blank" will run the new page on the same process as your page. If the new page is executing expensive JS, your page's performance may suffer. To avoid this use rel=noopener.`

- iframe 被恶意嵌套问题
- 302跳转劫持问题
- 第三方资源js 本身存在安全问题
- 第三方css偷取密码问题
- 可执行文件上传漏洞
- http明文传输本身存在问题
- web前端针对 法律法规存在的文案问题
- 公开的信息被恶意批量爬取，比如有效资源，联系电话：见https://www.dianping.com/shop/57504830

- ? iframe 沙箱
#### 后端

- SQL 注入： sqlmap，中国菜刀
- DDos攻击
- DB权限扩散导致的数据泄露风险
- 敏感信息加密程度低存在的可能被撞库问题
- 目录向上遍历漏洞
- 弱口令问题
- 越权问题：只检测登录态是否有效，不检测是否为对应用户的登录态
- 逻辑错误，比如通过手机号就能找回密码
