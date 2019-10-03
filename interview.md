
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
    - 添加响应头：X-XSS-Protection(只可以防御反射型)，其原理是检查url和dom中元素的相关性. 但这并不能完全防止反射型xss. 这里有个可供测试的链接,[XSS Test Page](http://www.enhanceie.com/test/xss/).
        - 开启这个功能后，当浏览器检测到跨站脚本攻击（XSS）时，浏览器将对页面做清理或直接阻止整个页面的加载。
        - IE、Chrome 和 Safari 都内置了这个模块。edge 和火狐没有内置这个模块。
        - 在 IE 上它叫 XSS Filter，在 Chrome 上它叫 XSS Auditor（不过[chrome准备弃用XSS Auditor](https://linux.cn/article-11112-1.html)）。
        - 可以为尚不支持 CSP 的旧版浏览器的用户提供保护
        - 几个用法：
            - X-XSS-Protection : 0，禁用 XSS 过滤这个功能
            - X-XSS-Protection : 1，启用 XSS 过滤，一般浏览器中都是默认开启。如果检测到跨站脚本攻击，浏览器将清除在页面上检测到的不安全的部分
            - X-XSS-Protection : 1; mode=block，如果检测到攻击，浏览器不会像上面的选项一样将不安全的部分删除，而是直接阻止整个页面的加载
            - X-XSS-Protection : 1; report=<reporting-uri>，如果检测到跨站脚本攻击，浏览器会清除在页面上检测到的不安全的部分，并使用report-uri的功能 POST 一个 XSS 警报。这个功能只有在 Chrome 中有效果，在 IE 中无效。
        - 不同看法，有人认为X-XSS-Protection 最差的设置是X-XSS-Protection : 1，因为这可能造成 页面上的代码被误删除，攻击者恰巧可以利用这一漏洞来让页面不可运行。
            - 文章：https://blog.innerht.ml/the-misunderstood-x-xss-protection/，乞丐版翻译：https://www.freebuf.com/articles/web/138769.html
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
    - 1.在 a 标签的 rel 属性中指定 rel="noopener",这种方法IE上基本不支持
    - 2.在 a 标签的 rel 属性中指定 rel="noreferrer",这种方法IE10及以下不支持，同时设置noreferrer，也会导致新页面无法通过document.referrer 获取到源信息。为了更好解决这个劫持漏洞，一般会同时设置rel="noreferrer noopener"。
    - 3. 如果需要照顾老旧浏览器，可以通过js打开页面：`var newTab = window.open(); newTab.opener = null; newTab.location = targetUrl`
- 延伸：rel="noopener" 对性能优化的帮助
    - 官方文档在介绍[a标签的target属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a)时表明，通过 target="_blank"打开新页面时，会在原页面所在的进程中打开新页面，如果新页面在执行耗时js，原页面的性能会受到影响。
    - 通过设置rel="noopener"，可以避免这种性能问题。
    - 原文：`Linking to another page using target="_blank" will run the new page on the same process as your page. If the new page is executing expensive JS, your page's performance may suffer. To avoid this use rel=noopener.`

###### iframe 被恶意嵌套问题
- 定义: 这定义就比较明确了，恶意站点www.hack.com 通过iframe嵌入你的站点www.hehe.com
- 危害:
    - 仍然是点击劫持，恶意站点在iframe上覆盖一个透明的a标签，然后点击引导到恶意站点，用户认为是一个安全的站点跳转过来，因此很可能信任新的页面
    - 收集用户信息，比如在恶意站点旁边或者上层显示登录注册的表单，引导用户在安全站点的账号密码信息
- 解决办法：
    - 1.通过js处理：
        - 方法：js 判断当前页面是否在顶层,如果自己的页面不在顶层，则认为被iframe嵌套引入，做跳转：`(window.top != window.self) && top.location.href = "yuor url"`;
        - 存在的问题：恶意站点在通过iframe嵌入你的站点的时候，可以 让iframe嵌入的站点无法执行js。比如这样`<iframe sandbox="" src="https://www.hehe.com"></iframe>`。sandbox的具体使用见下节。或者 `<iframe sandbox=”allow-forms allow-same-origin allow-scripts”></iframe>`,这样，就可以保证js脚本的执行，但是禁止iframe里的javascript执行top.location.href= "xxx"；

    - 2.通过给页面设置`X-Frame-Options`响应头,来决定站点能被那些站点嵌入。IE8就开始支持了。设置 meta 标签是无效的。
        - 一些配置
            - `X-Frame-Options: deny`：不允许在 frame 中展示，即便外层页面和要嵌入的页面同域
            - `X-Frame-Options: sameorigin`：外层页面如果和要嵌入的页面同域，则可以被嵌入
            - `X-Frame-Options: allow-from https://www.a.com/`：表示运行在那个站点中被作为iframe嵌入，只能支持单域名，并且浏览器对这个`allow-from`的支持不是太好，chrome就不支持。
        - 存在的问题：
            - 1. allow-from支持不太好，且不支持设置多个域名
            - 2. 这是一个非官方标准的响应头，只不过是较早实现，官方建议和CSP一同使用。

    - 3.CSP大法
        -  CSP中的frame-ancestors 指令指定了一个可以包含`<frame>，<iframe>，<object>，<embed>`等元素的有效父级,意思就是设置允许被哪些域进行嵌入
        - IE14之前除了13都不支持`frame-ancestors`,因此需要结合`X-Frame-Options`一起使用。
        - frame-ancestors策略可以设置一个或多个源，而且指定源的时候可以使用通配符，例如`Content-Security-Policy: frame-ancestors http://*.hehe.com`。
        - 几个demo
            - `Content-Security-Policy: frame-ancestors 'none';`其作用类似于X-Frame-Options: DENY
            - `Content-Security-Policy: frame-ancestors 'self';`其作用类似于X-Frame-Options: SAMEORIGIN
            - `Content-Security-Policy: frame-ancestors https://*.futunn.com  https://*.futu5.com;`表示允许被futunn和futu5下的域名进行嵌入

> 普通跨域的情况，iframe 是获取不到 `top.location.href`，但是可以设置`top.location.href`。

###### iframe 沙箱

- 定义：sandbox就是用来给指定iframe设置一个沙盒模型，限制iframe 嵌入页面的权限。（IE10才开始支持）。基本用法就是`<iframe sandbox="xx" src="xxx"></iframe>`
- iframe sandbox几个值的情况
    - ""： 空值，表示启用所有限制，限制如下：
        1. script脚本不能执行
        2. 不能发送ajax请求
        3. 不能使用本地存储，即localStorage,cookie等
        4. 不能创建新的弹窗和window
        5. 不能发送表单
        6. 不能加载额外插件比如flash等
    - allow-forms:允许进行提交表单
    - allow-scripts:运行执行脚本
    - allow-same-origin:允许同域请求,比如ajax,storage
    - allow-top-navigation:允许iframe能够主导window.top进行页面跳转
    - allow-popups:允许iframe中弹出新窗口,比如,window.open,target="_blank"
    - allow-pointer-lock:在iframe中可以锁定鼠标，主要和鼠标锁定有关（没太懂这个含义）



- 302跳转劫持问题
- 第三方资源js 本身存在安全问题
- 第三方css偷取密码问题
- 可执行文件上传漏洞
- http明文传输本身存在问题
- web前端针对 法律法规存在的文案问题
- 公开的信息被恶意批量爬取，比如有效资源，联系电话：见https://www.dianping.com/shop/57504830

#### 后端

- SQL 注入： sqlmap，中国菜刀
- DDos攻击
- DB权限扩散导致的数据泄露风险
- 敏感信息加密程度低存在的可能被撞库问题
- 目录向上遍历漏洞
- 弱口令问题
- 越权问题：只检测登录态是否有效，不检测是否为对应用户的登录态
- 逻辑错误，比如通过手机号就能找回密码
