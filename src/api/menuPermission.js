import { postRequest, getRequest } from './common'
import { permission as baseUrl } from './api'

// 获取应用
export const apiAppInfoQueryList = data => {
    return postRequest(`${baseUrl}/appInfo/appInfoQueryList`, data)
}

// 根据应用CODE查询菜单权限
export const apiMenuInfoQueryByAppCode = data => {
    return getRequest(`${baseUrl}/menu/menuInfoQueryByAppCode`, data)
}

// 添加菜单信息
export const apiMenuInfoAdd = data => {
    return postRequest(`${baseUrl}/menu/menuInfoAdd`, data)
}

// 修改菜单信息
export const apiMenuInfoUpdate = data => {
    return postRequest(`${baseUrl}/menu/menuInfoUpdate`, data)
}

// 删除菜单信息
export const apiCargoPageHomeList = data => {
    return getRequest(`${baseUrl}/menu/menuInfoDelete`, data)
}

// 根据ID查询菜单信息
export const apiMenuInfoQueryByMenuId = data => {
    return getRequest(`${baseUrl}/menu/menuInfoQueryByMenuId`, data)
}
