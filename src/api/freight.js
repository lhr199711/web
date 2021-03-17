import { postRequest, getRequest } from './common'
import { freight as baseUrl } from './api'

// 录入详细
export const apiAddFreight = (data) => {
    return postRequest(`${baseUrl}/customer/add-freight`, data)
}
// 销售录入
export const apiSaleAddFreight = (data) => {
    return postRequest(`${baseUrl}/sale/add-freight`, data)
}
// 调度录入
export const apiDispatchAddFreight = (data) => {
    return postRequest(`${baseUrl}/dispatch/add-freight`, data)
}
// 录入简易的
export const apiAddFreightSimple = (data) => {
    return postRequest(`${baseUrl}/customer/add-freight-simple`, data)
}
// 生成路线
export const apiGenerateRoute = (data) => {
    return postRequest(`${baseUrl}/customer/generate-route`, data)
}
// 发送
export const apiSendSale = (data) => {
    return postRequest(`${baseUrl}/customer/send-sale`, data)
}
// 销售发送调度
export const apiSendDispatch = (data) => {
    return postRequest(`${baseUrl}/sale/send-dispatch`, data)
}
// 详情
export const apiQueryDetailFreight = (data) => {
    return getRequest(`${baseUrl}/customer/query-detail-freight`, data)
}
// 列表
export const apiQueryListFreight = (data) => {
    return postRequest(`${baseUrl}/customer/query-list-freight`, data)
}
// 销售的列表
export const apiSaleQueryFreight = (data) => {
    return postRequest(`${baseUrl}/sale/query-list-freight`, data)
}
// 调度的列表
export const apiDispatchQueryFreight = (data) => {
    return postRequest(`${baseUrl}/dispatch/query-list-freight`, data)
}
// 销售查看详情
export const apiSaleQueryDetailFreight = (data) => {
    return getRequest(`${baseUrl}/sale/query-detail-freight`, data)
}
// 调度查看详情
export const apiDispatchQueryDetailFreight = (data) => {
    return getRequest(`${baseUrl}/dispatch/query-detail-freight`, data)
}
// 选择附加任务
export const apiGetTaskAffix = (data) => {
    return getRequest(`${baseUrl}/customer/get-task-affix/` + data.trspType + '/' + data.logisticsType)
}
// 生成物流方案
export const apiGetGenerate = (data) => {
    return getRequest(`${baseUrl}/get/generate`, data)
}
// 方案推荐状态扭转
export const apiModifyStatus = (data) => {
    return postRequest(`${baseUrl}/get/modify-status`, data)
}
// 客户同意方案
export const apiAgreeScheme = (data) => {
    return postRequest(`${baseUrl}/customer/agree-scheme`, data)
}
// 客户不同意方案
export const apiDisgreeScheme = (data) => {
    return postRequest(`${baseUrl}/customer/disagree-scheme`, data)
}
// 销售拒绝推荐方案
export const apiSaleRefuseRecommend = (data) => {
    return postRequest(`${baseUrl}/sale/refuse-recommend`, data)
}
// 同意推荐
export const apiSaleAgreeRecommend = (data) => {
    return postRequest(`${baseUrl}/sale/agree-recommend`, data)
}
// 调度推荐方案给销售
export const apiBakSale = (data) => {
    return postRequest(`${baseUrl}/dispatch/bak-sale`, data)
}
// 取消要求
export const apiCancelDemand = (data) => {
    return postRequest(`${baseUrl}/customer/cancel`, data)
}
