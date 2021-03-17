import { postRequest, getRequest } from '../common.js'
import { userCenter as baseUrl } from '../api'

//  新增机构信息
export const apiAddOrg = (data) => {
    return postRequest(`${baseUrl}/enterprise-organization/add`, data)
}
//  删除机构
export const apiDeleteOrg = (data) => {
    return getRequest(`${baseUrl}/enterprise-organization/delete`, data)
}
//  修改机构
export const apiEdit = (data) => {
    return postRequest(`${baseUrl}/enterprise-organization/edit`, data)
}
//  更改机构状态
export const apiStatusOrg = (data) => {
    return postRequest(`${baseUrl}/enterprise-organization/status`, data)
}
//  获取机构树状数据
export const apiGetOrganTreeData = (data) => {
    return getRequest(`${baseUrl}/enterprise-organization/organTreeData`, data)
}
//  获取关联角色数据
export const apiGetOrganRoleData = (data) => {
    return getRequest(`${baseUrl}/enterprise-organization/organRoleData`, data)
}
//  获取未关联角色数据
export const apiGetOrganNoRoleData = (data) => {
    return postRequest(`${baseUrl}/enterprise-organization/organNoRoleData`, data)
}
//  保存未关联角色数据
export const apiSaveOrganRole = (data) => {
    return postRequest(`${baseUrl}/enterprise-organization/organRoleSave`, data)
}
//  解除关联角色数据
export const apiDeleteOrganRole = (data) => {
    return postRequest(`${baseUrl}/enterprise-organization/organRoleDelete`, data)
}
//  获取关联用户数据
export const apiGetOrganUserData = (data) => {
    return postRequest(`${baseUrl}/enterprise-organization/organAccountData`, data)
}
//  获取未关联用户数据
export const apiGetOrganNoUserData = (data) => {
    return postRequest(`${baseUrl}/enterprise-organization/organNoAccountData`, data)
}
//  保存未关联用户数据
export const apiSaveOrganUserData = (data) => {
    return postRequest(`${baseUrl}/enterprise-organization/organAccountSave`, data)
}
//  解除关联用户数据
export const apiDeleteOrganAccount = (data) => {
    return postRequest(`${baseUrl}/enterprise-organization/organAccountDelete`, data)
}
