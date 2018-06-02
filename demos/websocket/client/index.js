/**
 * websocket 客户端
 */

// 实例化一个连接
var ws = new WebSocket ('ws://localhost:8080');

Object.assign(ws,{
    // 建立连接
    onopen: function(){
        console.log('opened');

        ws.send('hello server,i\'m client');
    },
    // 接受到消息
    onmessage: function(e){
        console.log('mesasge:' + e.data);
    }
});


