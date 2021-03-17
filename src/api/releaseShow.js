import { postRequest } from './common.js'

// 获取订单货值
export const apiGetOrderValue = data => {
    return postRequest('/order/statistics/getOrderGoodsValueStatistics', data)
}

// 获取订单数量
export const apiGetOrderNumber = data => {
    return postRequest('/order/statistics/getOrderNumStatistics', data)
}

// 获取物流节点
export const apiGetStatisticsNode = data => {
    return postRequest('/corridor/statistics/getLogisticsNodeStatistics', data)
}

// 获取8条通道的名称
export const apiGetCorridorsName = data => {
    return postRequest('/corridor/statistics/getTotalCorridorNameStatistics', data)
}

// 获取通道信息
export const apiGetCorridorsInfo = data => {
    return postRequest('/corridor/statistics/getTotalCorridorStatistics', data)
}
