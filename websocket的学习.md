# websocket

## 前置知识

在学习websocket的时候，往往需要对照http协议来比较，因此是十分必要先普及一下http的相关知识。

#### http1.0/1.1、keep-live
1. http是一个请求-响应的协议，也就是一个Request对应一个response，不会对应多个。而且顺序也是先有请求再有响应，response不能主动发起。
2. http协议分为了0.9(已过时)，1.0 和 1.1，2.0(这里不讲)。
3. 在http1.0 中，每一个http请求，客户端都要和服务端新建一个TCP连接，完成之后立即断开连接；在http1.1 中，引入了保持连接（keep-live）的机制,一次TCP连接，可以有多组请求-响应，而不必多次建立TCP连接。

![HTTP_persistent_connection.svg](./asserts/HTTP_persistent_connection.svg)

#### 短轮询、长轮询

- 短轮询: 在特定的的时间间隔（如每1秒），由浏览器对服务器发出HTTP请求，然后由服务器返回最新的数据给客户端的浏览器.

![](./asserts/short.jpg)

- 长轮询: 一次HTTP请求的过程中，若是服务器端数据并没有更新，那么则将这个连接挂起，直到服务器推送新的数据，再返回

![](./asserts/long.jpg)

>注意：

>1. 经常会有文章提到短链接、长连接，这个是TCP才有的;

>2. HTTP1.1 里面，Connection为keep-alive时，使用的就是TCP长连接，而HTTP本身没有长连接，短链接之说。

>3. 长短轮询是服务端通过编程的方式来实现的，而长短链接是通过TCP传输协议来规定和实现的。

## 一、什么是websocket

#### 0. 什么是websocket
- 一种浏览器和服务器间进行`双向会话`的高级技术(新协议)，在HTML5中开始支持
- 可以向服务器发送消息
- 接受基于事件驱动的响应，而不是向服务器轮训

一次websocket连接如下:
![](./asserts/websocket.jpg)

#### 1. 和普通HTTP协议的异同

###### 相同点：

1. 都是计算机网络应用层的协议。
2. 都是基于TCP来简历连接，使用相同的TCP端口；默认情况下，Websocket协议使用80端口；运行在TLS之上时，默认使用443端口。
3. 类似于与http与https，websocket也分为`ws`和`wss`协议头
```
ws://example.com/wsapi
wss://secure.example.com/
```

###### 不同点/特点：
1. Websocket其实是一个新协议，跟HTTP协议基本没有关系,它是HTTP协议上的一种补充,有交集，但是并不是全部。
![websocket vs http](./asserts/websocket-http.jpg)

2. websocket是双向会话，可以互相主动请求发出消息，而HTTP需要客户端向服务端发起请求，服务端才能给出响应

![](./asserts/transfer.png)

3. 在websocket应用中，Websocket协议通过第一个request建立了TCP连接之后，之后交换的数据都不需要发送 HTTP header就能交换数据，而每一次HTTP请求，服务端和客户端自己钱都要交换大量的请求头、

![](./asserts/frames.png)

###### 联系

#### 2. 有哪些优点

#### 3. 学习门槛

#### 4. 兼容性

- 支持性良好
- IE9 上不适用

![](./source/websocket.jpg)

> 
## 二、开发入门

## 三、Step-by-Step

#### 1. 服务端
NodeJS本身并没有原生的WebSocket支持，但是有第三方的实现。这里，选择`ws`来作为服务端实现。

#### 2. 客户端

#### 3. 协议详解

## 四、适用场景

### 参考链接：
- <http://www.cnblogs.com/skynet/archive/2010/12/11/1903347.html>
- <https://mp.weixin.qq.com/s/JPU0CsZ2ktnMRz5XtgBlPQ>
- <http://www.ruanyifeng.com/blog/2017/05/websocket.html>
- <https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001472780997905c8f293615c5a42eab058b6dc29936a5c000>
- <https://juejin.im/post/5b0351b051882542821ca2a1?utm_source=gold_browser_extension>
- <http://ued.sina.com.cn/?p=900>
- [爱测未来性能-你不得不知道的WebSocket](https://blog.csdn.net/itest_2016/article/details/72395818)
- [WebSocket 是什么原理？为什么可以实现持久连接](https://www.zhihu.com/question/20215561)
- [谈谈HTTP协议中的短轮询、长轮询、长连接和短连接](https://mp.weixin.qq.com/s/Jo2G-1OE8s8BEEdsnjAhtQ)