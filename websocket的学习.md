# websocket

## 1、前置知识

在学习websocket的时候，往往需要对照http协议来比较，因此是十分必要先普及一下http的相关知识。

#### 1.1 http1.0/1.1、keep-live
1. http是一个请求-响应的协议，也就是一个Request对应一个response，不会对应多个。而且顺序也是先有请求再有响应，response不能主动发起。
2. http协议分为了0.9(已过时)，1.0 和 1.1，2.0(这里不讲)。
3. 在http1.0 中，每一个http请求，客户端都要和服务端新建一个TCP连接，完成之后立即断开连接；在http1.1 中，引入了保持连接（keep-live）的机制,一次TCP连接，可以有多组请求-响应，而不必多次建立TCP连接。

![HTTP_persistent_connection.svg](./asserts/HTTP_persistent_connection.svg)

#### 1.2 短轮询、长轮询

- 短轮询: 在特定的的时间间隔（如每1秒），由浏览器对服务器发出HTTP请求，然后由服务器返回最新的数据给客户端的浏览器.

![](./asserts/short.jpg)

- 长轮询: 一次HTTP请求的过程中，若是服务器端数据并没有更新，那么则将这个连接挂起，直到服务器推送新的数据，再返回

![](./asserts/long.jpg)

>注意：

>1. 经常会有文章提到短链接、长连接，这个是TCP才有的;

>2. HTTP1.1 里面，Connection为keep-alive时，使用的就是TCP长连接，而HTTP本身没有长连接，短链接之说。

>3. 长短轮询是服务端通过编程的方式来实现的，而长短链接是通过TCP传输协议来规定和实现的。

## 2. 什么是websocket

#### 2.1. 什么是websocket
- 一种浏览器和服务器间进行`双向会话`的高级技术(新协议)，在HTML5中开始支持
- 可以向服务器发送消息
- 接受基于事件驱动的响应，而不是向服务器轮训

一次websocket连接如下:
![](./asserts/websocket.jpg)

#### 2.2  和普通HTTP协议的异同

###### 2.2.1 相同点：

1. 都是计算机网络应用层的协议。
2. 都是基于TCP来建立连接，使用相同的TCP端口；默认情况下，Websocket协议使用80端口；运行在TLS之上时，默认使用443端口。
3. 类似于与http与https，websocket也分为`ws`和`wss`协议头
```
ws://example.com/wsapi
wss://secure.example.com/
```

###### 2.2.2 不同点/特点：
1. Websocket其实是一个新协议，跟HTTP协议基本没有关系,它是HTTP协议上的一种补充,有交集，但是并不是全部。
![websocket vs http](./asserts/websocket-http.jpg)

2. websocket是双向会话，可以互相主动请求发出消息，而HTTP需要客户端向服务端发起请求，服务端才能给出响应
![](./asserts/transfer.png)

3. 在websocket应用中，Websocket协议通过第一个request建立了TCP连接之后，之后交换的数据都不需要发送 HTTP header就能交换数据，而每一次HTTP请求，服务端和客户端自己钱都要交换大量的请求头、

![](./asserts/frames.png)

###### 2.2.3 联系

WebSocket在建立握手连接时，数据是通过http协议传输的，这里面用到的只是http协议一些简单的字段。但是在建立连接之后，真正的数据传输阶段是不需要http协议参与的。
建立连接的过程是这样的：

1. 浏览器与WebSocket服务器通过TCP三次握手建立连接，如果这个建立连接失败，那么后面的过程就不会执行，Web应用程序将收到错误消息通知。

2. 在TCP建立连接成功后，浏览器通过http协议传送WebSocket支持的版本号，协议的字版本号，原始地址，主机地址等等一些列字段给服务器端。例如：
```
GET ws://localhost:8080/ HTTP/1.1
Host: localhost:8080
Connection: Upgrade
Pragma: no-cache
Cache-Control: no-cache
Upgrade: websocket
Origin: http://localhost:3000
Sec-WebSocket-Version: 13
User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36
DNT: 1
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Sec-WebSocket-Key: FFIay2n7pxO1jRaR4IiuBw==
Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
```

3. WebSocket服务器收到浏览器发送来的握手请求后，如果数据包数据和格式正确，客户端和服务器端的协议版本号匹配等等，就接受本次握手连接，并给出相应的数据回复，同样回复的数据包也是采用http协议传输。
```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: RH4E4orwcBih78+xUKYeQYWgsCQ=
```

4. 浏览器收到服务器回复的数据包后，如果数据包内容、格式都没有问题的话，就表示本次连接成功，触发onopen事件，此时通过send接口想服务器发送数据。否则，握手连接失败，触发onerror事件,数据传输过程不需要http协议的参与。

#### 2.3 websocket相比http的 优势

- `被动VS主动`:websocket全双工，浏览器和服务端可以相互主动发消息。
- `即时通讯`: websocket相对于http的优点，更多的体现在即时通讯应用上。相比于传统的实现方式
短轮询、长轮询，websocket的优势在于：
    - header：每一次HTTP请求，服务端和客户端自己钱都要交换大量的请求头、
，而websocket只在建立连接是才交换http header；
    - 效率：短轮询中客户端频繁的发请求，服务端的数据无变化，造成通信低效；长轮询在通信不频繁时，后端有数据变化时才给与客户端回复，一个http请求的周期过长，实时性不高，在通信比较频繁的时候，和短轮询的形式比较相近。
    - 实现：长短轮询的实现都需要通过代码来控制实现，而websocket本身就支持双向通讯，开发起来更加简单。
- `跨域`：websocket不适用于同源策略，支持跨域通信；WebSocket 客户端和服务端建立连接时，header中带有origin字段标识脚本请求的源，服务端可以根据该字段来判断是否同意建立连接。

#### 2.3 兼容性

- 支持性良好
- IE9 上不适用

![](./source/websocket.jpg)

## 3. Step-by-Step

#### 3.1 服务端
NodeJS本身并没有原生的WebSocket支持，但是有第三方的实现。这里，选择`ws`来作为服务端实现。使用koa2来搭建http服务。

```
/**
 * node ./test/server.js
 */
const Koa = require('koa');
const app = new Koa();
const staticServe = require('koa-static');
const logger = require('koa-logger');
const path = require('path');

// 静态资源目录对于相对入口文件server.js的路径
const staticPath = path.join(__dirname, '../');
// 装载路由
app.use(logger())
    .use(staticServe(staticPath, {
        index: 'index.html'
    }));

// websocket
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({
    port: 8080
});

// 建立连接
wss.on('connection', function connection(ws) {
    console.log('server: connection.');
    // 接受客户端消息
    ws.on('message', function incoming(message) {
        console.log('server: received: %s', message);
        // 向客户端发送消息
        ws.send('hello client,this is server');
    });
    ws.send('server: connection.');
});

// 启动server并打开默认链接
app.listen(3000, () => {
    console.log('start on http://localhost:3000');
});

```

#### 3.2 客户端

客户端直接直接使用webSocket对象建立连接。

```
// 实例化一个连接
var ws = new WebSocket ('ws://localhost:8080');

Object.assign(ws,{
    // 建立连接
    onopen: function(){
        console.log('opened');

        // FASO发送消息
        ws.send('hello server,i\'m client');
    },
    // 接受到消息
    onmessage: function(e){
        console.log('mesasge:' + e.data);
    }
});
```

#### 3.3 协议详解

建立连接：
```
GET ws://localhost:8080/ HTTP/1.1
# 请求的方法必须是GET，HTTP版本必须至少是1.1

Host: localhost:8080
# 建立连接的服务端host

Connection: Upgrade
#表示客户端希望连接升级

Pragma: no-cache
Cache-Control: no-cache
# 请求不缓存

Upgrade: websocket
#表示希望升级到Websocket协议 

Origin: http://localhost:3000
#表示在浏览器中发起此Websocket连接所在的页面，类似于Referer。但是，与Referer不同的是，Origin只包含了协议和主机名称,服务端可以根据此字段来决定是否建立连接

Sec-WebSocket-Version: 13
#表示支持的Websocket版本，目前必须只能是13，之前版本已弃用。

User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36
#客户端代理信息

DNT: 1
# DO NOT TRACK的缩写，要求服务器程序不要跟踪记录用户信息

Accept-Encoding: gzip, deflate, br
#浏览器可以处理的编码方式

Accept-Language: zh-CN,zh;q=0.9
#浏览器接收的语言，其实也就是用户在什么语言地区

Sec-WebSocket-Key: FFIay2n7pxO1jRaR4IiuBw==
#一个随机的经过base64编码的字符串，像密钥一样用于服务器和客户端的握手过程

Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits
# 扩展请求头字段

```

响应连接：
```
HTTP/1.1 101 Switching Protocols
# 通过Upgrade消息头通知客户端采用不同的协议来完成这个请求

Upgrade: websocket
# 表示升级的协议为websocket

Connection: Upgrade
# 表示升级连接

Sec-WebSocket-Accept: RH4E4orwcBih78+xUKYeQYWgsCQ=
# 根据客户端请求首部的Sec-WebSocket-Key计算出来的值，同Sec-WebSocket-Ke一起提供基础的防护，减少恶意连接、意外连接
```

## 4 适用场景与问题

#### 4.1 适用我们的场景
1. 在线咨询 
在线咨询目前使用的是短轮询，不断发送请求询问客服是否有回复
2. 发布系统
发布系统在发布过程中，更新进度是通过不断的发送请求来获取最新进度
3. 微信小程序/小游戏
小程序的架构非常简单，这里有两条网络同步，一条是 HTTPS 通路，用于常规请求。对于 WebSocket 请求，会先走 HTTPS 后再切换协议到 WebSocket 的 TCP 连接，从而实现全双工通信。详细见腾讯云[专栏](https://cloud.tencent.com/document/product/448/6405)
![](./asserts/wxapp.jpg)
4. 移动端股票分时数据
5. 相关推广活动的实时数据比如：排行榜，报名人数，参与游戏人数

#### 4.2 问题

###### 4.2.1 兼容性问题
移动端支持良好，web端不支持IE9及以下版本，需要提过flash插件来实现兼容处理。
比如：[web-socket-js](https://github.com/gimite/web-socket-js)

![](./asserts/web-socket-js.jpg)

###### 4.4.2 安全问题
WebSocket作为一种通信协议引入到Web应用中，并不会解决Web应用中存在的安全问题，因此WebSocket应用的安全实现是由开发者或服务端负责。

- **认证**:WebSocket 协议没有规定服务器在握手阶段应该如何认证客户端身份。服务器可以采用任何 HTTP 服务器的客户端身份认证机制，如 cookie认证，HTTP 基础认证，TLS 身份认证等。

- **授权**:同认证一样，WebSocket协议没有指定任何授权方式，应用程序中用户资源访问等的授权策略由服务端或开发者实现。

- **跨域请求**:WebSocket使用基于源的安全模型，在发起WebSocket握手请求时，浏览器会在请求中添加一个名为Origin的HTTP头，Oringin字段表示发起请求的源，以此来防止未经授权的跨站点访问请求。WebSocket 的客户端不仅仅局限于浏览器，因此 WebSocket 规范没有强制规定握手阶段的 Origin 头是必需的，并且WebSocket不受浏览器同源策略的限制。如果服务端没有针对Origin头部进行验证可能会导致跨站点WebSocket劫持攻击。
- **拒绝服务**:
    + 客户端拒绝服务

    WebSocket连接限制不同于HTTP连接限制，和HTTP相比，WebSocket有一个更高的连接限制，不同的浏览器有自己特定的最大连接数,如：火狐浏览器默认最大连接数为200。**通过发送恶意内容，用尽允许的所有Websocket连接耗尽浏览器资源，引起拒绝服务***。

    + (2). 服务器端拒绝服务

    WebSocket建立的是持久连接，只有客户端或服务端其中一方提出关闭连接的请求，WebSocket连接才关闭，因此**攻击者可以向服务器发起大量的申请建立WebSocket连接的请求，建立持久连接，耗尽服务器资源，引发拒绝服务**。针对这种攻，可以通过设置单IP可建立连接的最大连接数的方式防范。攻击者还可以通过发送一个单一的庞大的数据帧(如, 2^16)，或者发送一个长流的分片消息的小帧，来耗尽服务器的内存，引发拒绝服务攻击, 针对这种攻击，通过限制帧大小和多个帧重组后的总消息大小的方式防范。

## 参考链接：
- [HTTP Keep-Alive模式](http://www.cnblogs.com/skynet/archive/2010/12/11/1903347.html)
- [WebSocket：5分钟从入门到精通](https://mp.weixin.qq.com/s/JPU0CsZ2ktnMRz5XtgBlPQ)
- [全双工通信的 WebSocket](https://juejin.im/post/5b0351b051882542821ca2a1?utm_source=gold_browser_extension)
- [WebSocket实战](http://ued.sina.com.cn/?p=900)
- [爱测未来性能-你不得不知道的WebSocket](https://blog.csdn.net/itest_2016/article/details/72395818)
- [WebSocket 是什么原理？为什么可以实现持久连接](https://www.zhihu.com/question/20215561)
- [谈谈HTTP协议中的短轮询、长轮询、长连接和短连接](https://mp.weixin.qq.com/s/Jo2G-1OE8s8BEEdsnjAhtQ)
- [WebSocket应用安全问题分析](https://security.tencent.com/index.php/blog/msg/119)
