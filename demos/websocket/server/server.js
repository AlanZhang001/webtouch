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
