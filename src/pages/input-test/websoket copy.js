const WSS_URL = 'ws://121.40.165.18:8800'
let Socket = null
// let setIntervalWesocketPush = null

/**
 * 建立连接 */
export function createSocket () {
    if (!Socket) {
        console.log('建立websocket连接')
        Socket = new WebSocket(WSS_URL)
        Socket.onopen = onopenWS
        Socket.onmessage = onmessageWS
        Socket.onerror = onerrorWS
        Socket.onclose = oncloseWS
    } else {
        console.log('websocket已连接')
    }
}

/**
 * 打开WS之后发送心跳 */
export function onopenWS () {
    // 发送心跳
    sendPing()
}
/**
 * 连接失败重连 */
export function onerrorWS () {
    // clearInterval(setIntervalWesocketPush)
    Socket.close()
    // 重连
    createSocket()
}
/**
 * WS数据接收统一处理 */
export function onmessageWS (e) {
    // return e
    console.log(e)
    window.dispatchEvent(new CustomEvent('onmessageWS', {
        detail: {
            data: e
        }
    }))
}
/** 发送数据
 *  @param eventType
 */
export function sendWSPush (eventTypeArr) {
    console.log(eventTypeArr)
    const obj = {
        appId: 'airShip',
        cover: 0,
        event: eventTypeArr
    }
    if (Socket !== null && Socket.readyState === 3) {
        Socket.close()
        // 重连
        createSocket()
    } else if (Socket.readyState === 1) {
        Socket.send(JSON.stringify(obj))
    } else if (Socket.readyState === 0) {
        setTimeout(() => {
            Socket.send(JSON.stringify(obj))
        }, 3000)
    }
}
/**
 * 关闭WS */
export function oncloseWS () {
    // clearInterval(setIntervalWesocketPush)
    console.log('websocket已断开')
}
/**
 *  发送心跳 */
export function sendPing (data) {
    console.log(data)
    Socket.send(data)
    // setIntervalWesocketPush = setInterval(() => {
    //     Socket.send('ping')
    // }, 5000)
}
