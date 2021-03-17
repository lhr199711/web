import { postRequest, getRequest } from '../common'
import { home as baseUrl } from '../api'

// 获取运输产品数据
export const apiQueryTransport = (data) => {
    return getRequest(`${baseUrl}/home/server/transport`, data)
}
// 获取场所产品数据
export const apiQueryStation = (data) => {
    return getRequest(`${baseUrl}/home/server/station`, data)
}
// 获取关务产品数据
export const apiQueryCustoms = (data) => {
    return getRequest(`${baseUrl}/home/server/customs`, data)
}
// 获取订单数据
export const apiQueryOrder = (data) => {
    return getRequest(`${baseUrl}/home/server/order`, data)
}
// 获取地图路线数据
export const apiQueryRoute = (data) => {
    return getRequest(`${baseUrl}/home/server/road`, data)
}
// 获取通道数据
export const apiQueryAisle = (data) => {
    return getRequest(`${baseUrl}/home/server/route`, data)
}
// 获取启用状态数据项信息
export const apiDelBasicTask = (data) => {
    return postRequest(`${baseUrl}/task-base/del`, data)
}
