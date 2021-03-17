import { postRequest, getRequest } from './common.js'
import { permission as baseUrl } from './api'

//  查询组织机构信息
export const apiGetOrganizationList = (data) => {
    return getRequest(`${baseUrl}/organizationInfo/getOrganizationList`, data)
}

//  新增组织机构信息
export const apiAddOrganization = (data) => {
    return postRequest(`${baseUrl}/organizationInfo/addOrganization`, data)
}

//  修改组织机构信息
export const apiModifyOrganization = (data) => {
    return postRequest(`${baseUrl}/organizationInfo/modifyOrganization`, data)
}
