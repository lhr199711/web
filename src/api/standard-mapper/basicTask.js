import { postRequest, getRequest } from '../common'
import { mould as baseUrl } from '../api'

// 分页查询基础任务基础信息
export const apiBasicTaskQuery = (data) => {
    return postRequest(`${baseUrl}/task-base/query-page`, data)
}
// 新增基础任务
export const apiBasicTaskAdd = (data) => {
    return postRequest(`${baseUrl}/task-base/add`, data)
}
// 编辑基础任务
export const apiUpdateBasicTask = (data) => {
    return postRequest(`${baseUrl}/task-base/update`, data)
}
// 基础任务启用、基础任务启用申请
export const apiBasicTaskEnable = (data) => {
    return postRequest(`${baseUrl}/task-base/enable`, data)
}
// 基础任务停用、基础任务停用申请
export const apiBasicTaskDisable = (data) => {
    return postRequest(`${baseUrl}/task-base/disable`, data)
}
// 基础任务启用审核通过
export const apiBasicTaskEnableExamPass = (data) => {
    return postRequest(`${baseUrl}/task-base/enable-exam-pass`, data)
}
// 基础任务启用审核不通过
export const apiBasicTaskEnableExamFail = (data) => {
    return postRequest(`${baseUrl}/task-base/enable-exam-fail`, data)
}
// 基础任务停用审核通过
export const apiBasicTaskDisableExamPass = (data) => {
    return postRequest(`${baseUrl}/task-base/disable-exam-pass`, data)
}
// 基础任务停用审核不通过
export const apiBasicTaskDisableExamFail = (data) => {
    return postRequest(`${baseUrl}/task-base/disable-exam-fail`, data)
}
// 基础任务详情
export const apiBasicTaskQueryDetail = (data) => {
    return getRequest(`${baseUrl}/task-base/query-detail`, data)
}
// 获取启用状态数据项信息
export const apiQueryEnableData = (data) => {
    return getRequest(`${baseUrl}/task-base/query-enable-data`, data)
}
// 获取启用状态数据项信息
export const apiDelBasicTask = (data) => {
    return postRequest(`${baseUrl}/task-base/del`, data)
}
