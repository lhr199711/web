import { postRequest, getRequest } from './common'
import { permission as baseUrl } from './api'

//  新增账户
export const apiAccountAdd = (data) => {
    return postRequest(`${baseUrl}/account/accountAdd`, data)
}

//  查询账户
export const apiAccountQueryById = (data) => {
    return getRequest(`${baseUrl}/account/accountQueryById`, data)
}

//  查询账户列表
export const apiAccountQueryList = (data) => {
    return postRequest(`${baseUrl}/account/accountQueryList`, data)
}

//  删除账户
export const apiAccountDeleteById = (data) => {
    return getRequest(`${baseUrl}/account/accountDeleteById`, data)
}

//  批量删除账户信息
export const apiAccountDeletes = (data) => {
    return postRequest(`${baseUrl}/account/accountDeletes`, data)
}

//  查询当前账户菜单权限
export const apiAccountQueryMenuInfoById = (data) => {
    return getRequest(`${baseUrl}/account/accountQueryMenuInfoById`, data)
}

//  查询当前账户角色信息
export const apiAccountQueryRoleInfoById = (data) => {
    return getRequest(`${baseUrl}/account/accountQueryRoleInfoById`, data)
}

//  修改账户
export const apiAccountUpdate = (data) => {
    return postRequest(`${baseUrl}/account/accountUpdate`, data)
}
