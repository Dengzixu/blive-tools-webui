export default {
  connect(wsServer: string, wsCallback: any, errCallback?: any) {
    if ('WebSocket' in window) {
      const ws = new WebSocket(wsServer) //创建WebSocket连接

      ws.onmessage = (event) => {
        wsCallback(JSON.parse(event.data))
      }

      ws.onerror = (event) => {
        errCallback(event)
      }
    } else {
      throw new Error('您的浏览器不支持 WebSocket')
    }
  }
}
