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

export const onopenWS = (e) => {
    console.log('连接成功')
    if (Socket.readyState === 1) {
        socketSend('测试数据')
    }
}

export const socketSend = (data) => {
    console.log(Socket.readyState)

    if (Socket.readyState === 1) {
        console.log(1212)
        Socket.send(data)
    }
    if (Socket.readyState !== null || Socket.readyState === 3) {
        Socket.close()
        createSocket()
    }
}

export const onmessageWS = (e) => {
    console.log(e.data)
}

export const onerrorWS = (e) => {
    console.log('错误')
}

export const oncloseWS = (e) => {
    console.log('关闭')
}
