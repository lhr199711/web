import { postRequest, getRequest } from './common'
import { login as baseUrl } from './api'

// 用户登录
export const apiAuthLogin = (data) => {
    return postRequest(`${baseUrl}/auth/login`, data)
}

// 新的用户登录
export const apiLogin = (data) => {
    return postRequest(`${baseUrl}/authGate/oauth/token`, data)
}

// 获取用户机构角色认证信息
export const apiGetOrg = (data) => {
    return getRequest(`${baseUrl}/permissionGate/account/identity`, data)
}

// 获取角色对应的菜单
export const apiGetOrgRoleMenuTree = (data) => {
    return postRequest(`${baseUrl}/permissionGate/account/identitySelection`, data)
}

export const apiAccount = (data) => {
    return getRequest(`${baseUrl}/auth/account`, data)
}
