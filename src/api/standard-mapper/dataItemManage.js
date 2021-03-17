import { postRequest, getRequest } from '../common'
import { mould as baseUrl } from '../api'

// 分页查询数据项基础信息
export const apiTemplateDataQuery = (data) => {
    return postRequest(`${baseUrl}/template-data/query-page`, data)
}
// 新增数据项
export const apiTemplateDataAdd = (data) => {
    return postRequest(`${baseUrl}/template-data/add`, data)
}
// 编辑数据项
export const apiUpdateTemplateData = (data) => {
    return postRequest(`${baseUrl}/template-data/modify`, data)
}
// 数据项启用、数据项启用申请
export const apiTemplateDataEnable = (data) => {
    return postRequest(`${baseUrl}/template-data/enable`, data)
}
// 数据项停用、数据项停用申请
export const apiTemplateDataDisable = (data) => {
    return postRequest(`${baseUrl}/template-data/disable`, data)
}
// 数据项启用审核通过
export const apiTemplateDataEnableExamPass = (data) => {
    return postRequest(`${baseUrl}/template-data/enable-exam-pass`, data)
}
// 数据项启用审核不通过
export const apiTemplateDataEnableExamFail = (data) => {
    return postRequest(`${baseUrl}/template-data/enable-exam-fail`, data)
}
// 数据项停用审核通过
export const apiTemplateDataDisableExamPass = (data) => {
    return postRequest(`${baseUrl}/template-data/disable-exam-pass`, data)
}
// 数据项停用审核不通过
export const apiTemplateDataDisableExamFail = (data) => {
    return postRequest(`${baseUrl}/template-data/disable-exam-fail`, data)
}
// 数据项详情
export const apiTemplateDataQueryDetail = (data) => {
    return getRequest(`${baseUrl}/template-data/query-detail`, data)
}
// 数据项删除
export const apiDelTemplateData = (data) => {
    return postRequest(`${baseUrl}/template-data/del`, data)
}
