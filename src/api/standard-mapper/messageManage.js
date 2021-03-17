import { postRequest, getRequest } from '../common'
import { mould as baseUrl } from '../api'

// 新增消息
export const apiAddMessage = (data) => {
    return postRequest(`${baseUrl}/message/add`, data)
}

// 列表
export const apiQueryList = (data) => {
    return postRequest(`${baseUrl}/message/query-list`, data)
}
// 编辑初始化数据
export const apiQueryInfo = (data) => {
    return getRequest(`${baseUrl}/message/query-info`, data)
}

// 编辑消息
export const apiUpdate = (data) => {
    return postRequest(`${baseUrl}/message/update`, data)
}

// 启用
export const apiEnable = (data) => {
    return postRequest(`${baseUrl}/message/enable`, data)
}

// 停用
export const apiDisable = (data) => {
    return postRequest(`${baseUrl}/message/disable`, data)
}

// 审核
export const apiExamine = (data) => {
    return postRequest(`${baseUrl}/message/examine`, data)
}

// 详情
export const apiDetail = (data) => {
    return getRequest(`${baseUrl}/message/query-detail`, data)
}

// 删除
export const apiDelData = (data) => {
    return postRequest(`${baseUrl}/message/delete`, data)
}
