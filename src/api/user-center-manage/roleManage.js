import { postRequest, getRequest } from '../common.js'
import { userCenter as baseUrl } from '../api'

// 新增角色
export const apiRoleAdd = (data) => {
    return postRequest(`${baseUrl}/enterprise-role/add`, data)
}
// 修改角色
export const apiRoleEdit = (data) => {
    return postRequest(`${baseUrl}/enterprise-role/update`, data)
}
// 修改角色状态
export const apiRoleStatus = (data) => {
    return postRequest(`${baseUrl}/enterprise-role/setStatus`, data)
}
// 角色列表分页
export const apiRoleList = (data) => {
    return postRequest(`${baseUrl}/enterprise-role/list`, data)
}
// 删除角色
export const apiRoleDelete = (data) => {
    return getRequest(`${baseUrl}/enterprise-role/delete`, data)
}
// 查询角色下的菜单
export const apiRoleMenuTreeSelect = (data) => {
    return getRequest(`${baseUrl}/role/roleMenuTreeSelect`, data)
}
// 配置菜单保存
export const apiRoleSaveRoleMenu = (data) => {
    return postRequest(`${baseUrl}/enterprise-role/saveRoleMenu`, data)
}
