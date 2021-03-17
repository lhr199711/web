import { postRequest, getRequest } from './common'
import { product as baseUrl } from './api'

// 运输产品
// 查询运输产品列表
export const apiTransportQueryList = (data) => {
    return postRequest(`${baseUrl}/transport/query-list`, data)
}
// 有效申请、有效
export const apiTransportAuditTrue = (data) => {
    return postRequest(`${baseUrl}/transport/exam-enable`, data)
}
// 失效申请、失效
export const apiTransportAuditFalse = (data) => {
    return postRequest(`${baseUrl}/transport/exam-disable`, data)
}
// 有效申请审核同意
export const apiTransportAuditTrueOk = (data) => {
    return postRequest(`${baseUrl}/transport/valid-exam-pass`, data)
}
// 有效申请审核不同意
export const apiTransportAuditTrueNo = (data) => {
    return postRequest(`${baseUrl}/transport/valid-exam-fail`, data)
}
// 失效申请审核同意
export const apiTransportAuditFalseOk = (data) => {
    return postRequest(`${baseUrl}/transport/disabled-exam-pass`, data)
}
// 失效申请审核不同意
export const apiTransportAuditFalseNo = (data) => {
    return postRequest(`${baseUrl}/transport/disabled-exam-fail`, data)
}
// 设置优惠折扣
export const apiTransportPrefPrice = (data) => {
    return postRequest(`${baseUrl}/transport/pref-price`, data)
}
// 取消优惠折扣
export const apiTransportOffPrice = (data) => {
    return postRequest(`${baseUrl}/transport/off-price`, data)
}
// 保存参数获取产品编号
export const apiTransportAddCode = (data) => {
    return getRequest(`${baseUrl}/transport/add-code`, data)
}
// 新增运输产品
export const apiTransportAddServer = (data) => {
    return postRequest(`${baseUrl}/transport/add-server`, data)
}
// 运输产品详情
export const apiTransportQueryDetail = (data) => {
    return getRequest(`${baseUrl}/transport/query-detail`, data)
}

// 场所产品
// 查询场所产品列表
export const apiStationQueryList = (data) => {
    return postRequest(`${baseUrl}/station/query-page`, data)
}
// 有效申请、有效
export const apiStationAuditTrue = (data) => {
    return postRequest(`${baseUrl}/station/exam-enable`, data)
}
// 失效申请、失效
export const apiStationAuditFalse = (data) => {
    return postRequest(`${baseUrl}/station/exam-disable`, data)
}
// 有效申请审核同意
export const apiStationAuditTrueOk = (data) => {
    return postRequest(`${baseUrl}/station/valid-exam-pass`, data)
}
// 有效申请审核不同意
export const apiStationAuditTrueNo = (data) => {
    return postRequest(`${baseUrl}/station/valid-exam-fail`, data)
}
// 失效申请审核同意
export const apiStationAuditFalseOk = (data) => {
    return postRequest(`${baseUrl}/station/disabled-exam-pass`, data)
}
// 失效申请审核不同意
export const apiStationAuditFalseNo = (data) => {
    return postRequest(`${baseUrl}/station/disabled-exam-fail`, data)
}
// 设置优惠折扣
export const apiStationPrefPrice = (data) => {
    return postRequest(`${baseUrl}/station/pref-price`, data)
}
// 取消优惠折扣
export const apiStationOffPrice = (data) => {
    return postRequest(`${baseUrl}/station/off-price`, data)
}
// 保存参数获取产品编号
export const apiStationAddCode = (data) => {
    return getRequest(`${baseUrl}/station/add-code`, data)
}
// 新增场所产品
export const apiStationAddServer = (data) => {
    return postRequest(`${baseUrl}/station/add-server`, data)
}
// 场所产品详情
export const apiStationQueryDetail = (data) => {
    return getRequest(`${baseUrl}/station/query-detail`, data)
}

// 关务产品
// 查询关务产品列表
export const apiCustomsQueryList = (data) => {
    return postRequest(`${baseUrl}/customs/query-page`, data)
}
// 有效申请、有效
export const apiCustomsAuditTrue = (data) => {
    return postRequest(`${baseUrl}/customs/exam-enable`, data)
}
// 失效申请、失效
export const apiCustomsAuditFalse = (data) => {
    return postRequest(`${baseUrl}/customs/exam-disable`, data)
}
// 有效申请审核同意
export const apiCustomsAuditTrueOk = (data) => {
    return postRequest(`${baseUrl}/customs/valid-exam-pass`, data)
}
// 有效申请审核不同意
export const apiCustomsAuditTrueNo = (data) => {
    return postRequest(`${baseUrl}/customs/valid-exam-fail`, data)
}
// 失效申请审核同意
export const apiCustomsAuditFalseOk = (data) => {
    return postRequest(`${baseUrl}/customs/disabled-exam-pass`, data)
}
// 失效申请审核不同意
export const apiCustomsAuditFalseNo = (data) => {
    return postRequest(`${baseUrl}/customs/disabled-exam-fail`, data)
}
// 设置优惠折扣
export const apiCustomsPrefPrice = (data) => {
    return postRequest(`${baseUrl}/customs/pref-price`, data)
}
// 取消优惠折扣
export const apiCustomsOffPrice = (data) => {
    return postRequest(`${baseUrl}/customs/off-price`, data)
}
// 保存参数获取产品编号
export const apiCustomsAddCode = (data) => {
    return getRequest(`${baseUrl}/customs/add-code`, data)
}
// 新增场所产品
export const apiCustomsAddServer = (data) => {
    return postRequest(`${baseUrl}/customs/add-server`, data)
}
// 场所产品详情
export const apiCustomsQueryDetail = (data) => {
    return getRequest(`${baseUrl}/customs/query-detail`, data)
}

// 场景
// 查询场景
export const apiQueryScene = (data) => {
    return postRequest(`${baseUrl}/server/query-scene`, data)
}
// 查询场景下的任务
export const apiQueryTaskBySceneCode = (data) => {
    return getRequest(`${baseUrl}/server/query-task`, data)
}

// 获取添加班期的编号
export const apiAddScheduleCode = (data) => {
    return getRequest(`${baseUrl}/transport/add-schedule-code`, data)
}
