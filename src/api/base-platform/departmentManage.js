import { postRequest, getRequest } from '../common.js'
import { system as baseUrl } from '../api'

//  新增机构信息
export const apiAddOrg = (data) => {
    return postRequest(`${baseUrl}/org/add`, data)
}
//  删除机构
export const apiDeleteOrg = (data) => {
    return getRequest(`${baseUrl}/org/delete`, data)
}
//  修改机构
export const apiEdit = (data) => {
    return postRequest(`${baseUrl}/org/edit`, data)
}
//  更改机构状态
export const apiStatusOrg = (data) => {
    return postRequest(`${baseUrl}/org/status`, data)
}
//  获取机构树状数据
export const apiGetOrganTreeData = (data) => {
    return getRequest(`${baseUrl}/org/organTreeData`, data)
}
//  获取关联角色数据
export const apiGetOrganRoleData = (data) => {
    return getRequest(`${baseUrl}/org/organRoleData`, data)
}
//  获取未关联角色数据
export const apiGetOrganNoRoleData = (data) => {
    return postRequest(`${baseUrl}/org/organNoRoleData`, data)
}
//  保存未关联角色数据
export const apiSaveOrganRole = (data) => {
    return postRequest(`${baseUrl}/org/organRoleSave`, data)
}
//  解除关联角色数据
export const apiDeleteOrganRole = (data) => {
    return postRequest(`${baseUrl}/org/organRoleDelete`, data)
}
//  获取关联用户数据
export const apiGetOrganUserData = (data) => {
    return postRequest(`${baseUrl}/org/organAccountPage`, data)
}
//  获取未关联用户数据
export const apiGetOrganNoUserData = (data) => {
    return postRequest(`${baseUrl}/org/organNoAccountData`, data)
}
//  保存未关联用户数据
export const apiSaveOrganUserData = (data) => {
    return postRequest(`${baseUrl}/org/organAccountSave`, data)
}
//  保存未关联用户数据
export const apiDeleteOrganAccount = (data) => {
    return postRequest(`${baseUrl}/org/organAccountDelete`, data)
}
