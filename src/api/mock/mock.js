import { getRequest } from '../common'
// const baseUrl = 'https://www.easy-mock.com/mock/5f6c1471b766f82502c8a5bc/anod'
const baseUrl = 'https://easy-mock.bookset.io/mock/5f6d8b4600ebeb0dc60afbf1/anod'

// 测试获取easymock数据
export const apiGetHhTestData = (data) => {
    return getRequest(`${baseUrl}/hh-test`, data)
}

// 获取机构数据
export const apiGetOrg = (data) => {
    return getRequest(`${baseUrl}/get-org`, data)
}

// 获取角色菜单
export const apiGetMenu = (data) => {
    return getRequest(`${baseUrl}/get-menu`, data)
}

// 获取货运需求
export const apiQueryFreightInfo = (data) => {
    return getRequest(`${baseUrl}/get-freight`, data)
}
