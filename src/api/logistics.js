import { postRequest } from './common'
import { logistics as baseUrl } from './api'

//  查询物流方案基本信息(带查询条件)
export const apiGetSchemeList = (data) => {
    return postRequest(`${baseUrl}/scheme/search/get-scheme`, data)
}
//  查询物流方案基本信息(带查询条件,确定唯一服务商时调用)
export const apiGetScheme = (data) => {
    return postRequest(`${baseUrl}/scheme/get-scheme`, data)
}
//  查询物流方案基本信息(带路线查询)(调度)
export const apiLogisticsSchemeDspt = (data) => {
    return postRequest(`${baseUrl}/scheme/get-list-dspt`, data)
}
//  查询物流方案基本信息(带路线查询)(销售)
export const apiLogisticsSchemeMkt = (data) => {
    return postRequest(`${baseUrl}/scheme/get-list-mkt`, data)
}
//  同意/拒绝推荐物流方案
export const apiRecommendPass = (data) => {
    return postRequest(`${baseUrl}/scheme/recommend-pass`, data)
}
//  查询物流方案详情信息(调度/销售)
export const apiGetSchemeDetails = (data) => {
    return postRequest(`${baseUrl}/scheme/get-scheme-details`, data)
}
//  查询物流方案详情信息(客户)
export const apiGetSceneCstm = (data) => {
    return postRequest(`${baseUrl}/scheme/get-scene-cstm`, data)
}
//  查询产品相关场景以及任务信息（销售/调度）
export const apiGetSceneQueryList = (data) => {
    return postRequest(`${baseUrl}/scheme/get-scene-list`, data)
}
//  查询产品相关场景以及任务信息（客户）
export const apiGetSceneQueryCstm = (data) => {
    return postRequest(`${baseUrl}/scheme/get-scene-query-cstm`, data)
}
//  推荐勾选(调度)
export const apiRecommendCheck = (data) => {
    return postRequest(`${baseUrl}/scheme/recommend-check`, data)
}
//  推荐当前路线方案(调度)
export const apiRecommendRoute = (data) => {
    return postRequest(`${baseUrl}/scheme/recommend-route`, data)
}
//  推荐全部方案(调度)
export const apiRecommendAll = (data) => {
    return postRequest(`${baseUrl}/scheme/recommend-all`, data)
}
//  推荐勾选(销售)
export const apiRecommendCheckCstm = (data) => {
    return postRequest(`${baseUrl}/scheme/recommend-check-cstm`, data)
}
//  推荐当前路线方案(销售)
export const apiRecommendRouteCstm = (data) => {
    return postRequest(`${baseUrl}/scheme/recommend-route-cstm`, data)
}
//  推荐全部方案(销售)
export const apiRecommendAllCstm = (data) => {
    return postRequest(`${baseUrl}/scheme/recommend-all-cstm`, data)
}
//  调度修改确认物流方案
export const apiRecommendModify = (data) => {
    return postRequest(`${baseUrl}/scheme/recommend-modify`, data)
}
// 生成物流方案
export const apiSchemeGenerate = (data) => {
    return postRequest(`${baseUrl}/scheme/generate`, data)
}
// 调度确认唯一服务商
export const apiConfirmOnlyScheme = (data) => {
    return postRequest(`${baseUrl}/scheme/confirm-only-scheme`, data)
}
