import { postRequest, getRequest } from '../common'
import { mould as baseUrl } from '../api'

// 新增场所
export const apiAddStation = (data) => {
    return postRequest(`${baseUrl}/station/add`, data)
}

// 编辑场所初始化数据
export const apiQueryInfo = (data) => {
    return getRequest(`${baseUrl}/station/query-info`, data)
}

// 编辑场所
export const apiUpdate = (data) => {
    return postRequest(`${baseUrl}/station/update`, data)
}

// 场所列表
export const apiQueryList = (data) => {
    return postRequest(`${baseUrl}/station/query-list`, data)
}

// 启用
export const apiEnable = (data) => {
    return postRequest(`${baseUrl}/station/enable`, data)
}

// 停用
export const apiDisable = (data) => {
    return postRequest(`${baseUrl}/station/disable`, data)
}

// 审核
export const apiExamine = (data) => {
    return postRequest(`${baseUrl}/station/examine`, data)
}

// 详情
export const apiDetail = (data) => {
    return getRequest(`${baseUrl}/station/query-detail`, data)
}

// 删除
export const apiDelData = (data) => {
    return postRequest(`${baseUrl}/station/delete`, data)
}
