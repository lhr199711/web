import { postRequest, getRequest } from '../common'
import { mould as baseUrl } from '../api'

// 新增单据保存
export const apiAdd = (data) => {
    return postRequest(`${baseUrl}/bills/add`, data)
}
// 数据项列表
export const apiGetTemplateList = (data) => {
    return postRequest(`${baseUrl}/bills/template-data`, data)
}
// 分页查询单据列表信息
export const apiQueryPage = (data) => {
    return postRequest(`${baseUrl}/bills/query-list`, data)
}
// 启用单据
export const apiEnable = (data) => {
    return postRequest(`${baseUrl}/bills/enable`, data)
}
// 禁用单据
export const apiDisable = (data) => {
    return postRequest(`${baseUrl}/bills/disable`, data)
}
// 启用审核通过
export const apiExamEnablePass = (data) => {
    return postRequest(`${baseUrl}/bills/enable-exam-pass`, data)
}
// 启用审核不通过
export const apiExamEnableFail = (data) => {
    return postRequest(`${baseUrl}/bills/enable-exam-fail`, data)
}
// 禁用审核通过
export const apiExamDisablePass = (data) => {
    return postRequest(`${baseUrl}/bills/disable-exam-pass`, data)
}
// 禁用审核不通过
export const apiExamDisableFail = (data) => {
    return postRequest(`${baseUrl}/bills/disable-exam-fail`, data)
}
// 单据删除
export const apiDel = (data) => {
    return postRequest(`${baseUrl}/bills/del`, data)
}
// 查看详情
export const apiQueryDetail = (data) => {
    return getRequest(`${baseUrl}/bills/query-detail`, data)
}
