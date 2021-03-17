import { postRequest, getRequest } from './common'
import { logisticsPlan as baseUrl } from './api'

// 查询城市
export const apiRouteInfo = (data) => {
    return getRequest(`${baseUrl}/plan/route-info`, data)
}
//  查询产品
export const apiQueryScene = (data) => {
    return postRequest(`${baseUrl}/plan/query-scene`, data)
}
// 保存
export const apiGenerate = (data) => {
    return postRequest(`${baseUrl}/plan/generate-plan`, data)
}
// 上报
export const apiReportPlan = (data) => {
    return postRequest(`${baseUrl}/plan/report-plan`, data)
}
// 查看详情
// /plan/route-detail/{planCode}
export const apiRouteDetail = (data) => {
    return getRequest(`${baseUrl}/plan/route-detail`, data)
}
// 点击详情的节点出现产品
export const apiSceneDetail = (data) => {
    return postRequest(`${baseUrl}/plan/query-scene-detail`, data)
}
// 同意
// /confirm-plan
export const apiConfirmPlan = (data) => {
    return postRequest(`${baseUrl}/plan/confirm-plan`, data)
}
// 下发
export const apiIssuedPlan = (data) => {
    return getRequest(`${baseUrl}/plan/issuedPlan`, data)
}
