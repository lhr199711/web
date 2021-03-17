import { postRequest, getRequest } from '../common.js'
import { userCenter as baseUrl } from '../api'

// 新增合作伙伴
export const apiAddPartner = (data) => {
    return postRequest(`${baseUrl}/enterprise-partner/addPartner`, data)
}
// 上传授权书
export const apiUploadPartner = (data) => {
    return getRequest(`${baseUrl}/enterprise-partner/addPartnerAccessory`, data)
}
// 删除合作伙伴
export const apiDeletePartner = (data) => {
    return getRequest(`${baseUrl}/enterprise-partner/delete/`, data)
}
// 编辑合作伙伴
export const apiEditPartner = (data) => {
    return postRequest(`${baseUrl}/enterprise-partner/editPartner`, data)
}
// 合作伙伴分页
export const apiGetPartnerList = (data) => {
    return postRequest(`${baseUrl}/enterprise-partner/list`, data)
}
// 查看授权书
export const apiLook = (data) => {
    return getRequest(`${baseUrl}/enterprise-partner/look/`, data)
}
