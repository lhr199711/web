import { postRequest, getRequest } from './common'
import { permission as baseUrl } from './api'

// 查询组织机构信息
export const apiGetOrganizationList = data => {
    return getRequest(`${baseUrl}/organizationInfo/getOrganizationList`, data)
}

// 查询岗位角色信息
export const apiGetRoleInfoTree = data => {
    return getRequest(`${baseUrl}/roleInfo/getRoleInfoTree`, data)
}

// 添加岗位角色信息
export const apiAddRoleInfo = data => {
    return postRequest(`${baseUrl}/roleInfo/addRoleInfo`, data)
}

// 修改岗位角色信息
export const apiModifyRoleInfo = data => {
    return postRequest(`${baseUrl}/roleInfo/modifyRoleInfo`, data)
}

// 删除岗位角色信息
export const apiDeleteRoleInfo = data => {
    return getRequest(`${baseUrl}/roleInfo/deleteRoleInfo`, data)
}

// 岗位角色绑定用户信息
export const apiAddRoleAccount = data => {
    return postRequest(`${baseUrl}/roleAccount/addRoleAccount`, data)
}

// 根据岗位获取菜单权限
export const apiMenuInfoQueryByOrganizationId = data => {
    return postRequest(`${baseUrl}/menu/menuInfoQueryByOrganizationIds`, data)
}

// 岗位角色绑定菜单权限
export const apiAddRoleAndMenu = data => {
    return postRequest(`${baseUrl}/roleMenu/addRoleAndMenu`, data)
}

// 查询岗位下用户列表
export const apiAccountQueryRoleList = data => {
    return postRequest(`${baseUrl}/account/accountQueryRoleList`, data)
}

// 查询用户列表
export const apiAccountQueryList = data => {
    return postRequest(`${baseUrl}/account/accountQueryList`, data)
}
