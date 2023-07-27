export default {
    connect(wsServer, wsCallback) {
        if ("WebSocket" in window) {
            const ws = new WebSocket(wsServer); //创建WebSocket连接

            ws.onmessage = (event) => {
                wsCallback(JSON.parse(event.data));
            };

            ws.onerror = ((event) => {
                console.log("WS error:" + event);
                throw "无法连接至服务器"
            });

        } else {
            throw "您的浏览器不支持 WebSocket";
        }
    }

}