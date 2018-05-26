/**
 * websocket 客户端
 */

var ws = new WebSocket ('ws://localhost:8080');

Object.assign(ws,{
    // 建立连接
    onopen: function(){
        console.log('opened');
    },
    // 接受到消息
    onmessage: function(e){
        console.log('mesasge:' + e.data);
    }
});
