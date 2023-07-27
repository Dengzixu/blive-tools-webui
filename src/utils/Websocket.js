export default {
    connect(wsCallback) {
        if ("WebSocket" in window) {
            const ws = new WebSocket("ws://localhost:25501/server"); //创建WebSocket连接

            ws.onmessage = (event) => {
                wsCallback(JSON.parse(event.data));
            }

        } else {
            console.log("您的浏览器不支持WebSocket");
        }
    }

}