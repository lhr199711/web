import { postRequest } from '../common'
import { mould as baseUrl } from '../api'

// 分页查询数据源基础信息
export const apiQueryUnusual = data => {
    return postRequest(`${baseUrl}/unusual/query-list`, data)
}
// 新增数据源
export const apiAddUnusual = data => {
    return postRequest(`${baseUrl}/unusual/add`, data)
}
// 数据源启用、数据源启用申请
export const apiEnableUnusual = data => {
    return postRequest(`${baseUrl}/unusual/enable`, data)
}
// 数据源停用、数据源停用申请
export const apiDisableUnusual = data => {
    return postRequest(`${baseUrl}/unusual/disable`, data)
}
// 数据源启用审核通过
export const apiEnableExamPassUnusual = data => {
    return postRequest(`${baseUrl}/unusual/enable-exam-pass`, data)
}
// 数据源启用审核不通过
export const apiEnableExamFailUnusual = data => {
    return postRequest(`${baseUrl}/unusual/enable-exam-fail`, data)
}
// 数据源停用审核通过
export const apiDisableExamPassUnusual = data => {
    return postRequest(`${baseUrl}/unusual/disable-exam-pass`, data)
}
// 数据源停用审核不通过
export const apiDisableExamFailUnusual = data => {
    return postRequest(`${baseUrl}/unusual/disable-exam-fail`, data)
}
// 数据源编辑
export const apiModifyUnusual = data => {
    return postRequest(`${baseUrl}/unusual/query-detail-modify`, data)
}
// 数据源删除
export const apiDelUnusual = data => {
    return postRequest(`${baseUrl}/unusual/del`, data)
}
