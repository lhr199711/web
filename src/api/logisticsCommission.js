/* eslint-disable */

import http from '@/libs/http'
import { Message } from 'view-design'
// import { postRequest } from './common'
import {
    entrust as baseUrl,
    dictionary as dicbaseUrl,
    product as productUrl,
    jz as jzUrl,
    home as homeUrl,
    system as systemUrl,
} from './api'
const replaceNull = (obj) => {
    for (let key in obj) {
        switch (Object.prototype.toString.call(obj[key]).slice(8, -1)) {
            case 'Object':
                replaceNull(obj[key])
                break
            case 'Array':
                for (let i = 0; i < obj[key].length; i++) {
                    replaceNull(obj[key][i])
                }
                break
            default:
                if (
                    obj[key] === null ||
                    obj[key] == 'null' ||
                    obj[key] == 'null,null,null'
                )
                    obj[key] = undefined
        }
    }
}
const getRequest = (url, path = {}, params = {}) => {
    let api = url
    if (path && Object.keys(path)) {
        Object.keys(path).forEach((item) => {
            api = api + `/${path[item]}`
        })
    }
    return http.get(api, params).then((res) => {
        if (res.code === '200') {
            replaceNull(res)
            return res
        } else if (res.code === '30002') {
            replaceNull(res)
            throw res
        } else {
            Message.info({ content: res.msg })
            replaceNull(res)
            throw res
        }
    })
}
const postRequest = (url, { path = {}, data = {} } = {}) => {
    let api = url
    if (path && Object.keys(path)) {
        Object.keys(path).forEach((item) => {
            api = api + `/${path[item]}`
        })
    }
    return http.post(api, { data: data }).then((res) => {
        if (res.code === '200') {
            replaceNull(res)
            return res
        } else {
            Message.info({ content: res.msg })
            replaceNull(res)
            throw res
        }
    })
}
//  新增单次物流委托/entrust/add-once-entrust
export const apiOnceEntrustInfoAdd = (data) => {
    return postRequest(`${baseUrl}/entrust/add-once-entrust`, data)
}

//  新增周期规律基本信息/entrust/add-period-entrust-basic
export const apiAddPeriodEntrustBasicInfo = (data) => {
    return postRequest(`${baseUrl}/entrust/add-period-entrust-basic`, data)
}
//  新增周期规律子信息/entrust/add-period-entrust-executory
export const apiAddPeriodEntrustExecutory = (data) => {
    return postRequest(`${baseUrl}/entrust/add-period-entrust-executory`, data)
}
//  查询列表/entrust/get-role-mkt-entrust-list（销售）
export const apiGetRoleMktEntrustList = (data) => {
    return postRequest(`${baseUrl}/entrust/get-role-mkt-entrust-list`, data)
}
//  查询列表/entrust/get-role-cstm-entrust-list（客户）
export const apiGetRoleCstmEntrustList = (data) => {
    return postRequest(`${baseUrl}/entrust/get-role-cstm-entrust-list`, data)
}
//  查询列表/entrust/get-role-dspt-entrust-list（调度）
export const apiGetRoleDsptEntrustList = (data) => {
    return postRequest(`${baseUrl}/entrust/get-role-dspt-entrust-list`, data)
}
//  改变委托状态/entrust/modify-entrust-status
export const apiModifyEntrustStatus = (data) => {
    return postRequest(`${baseUrl}/entrust/modify-entrust-status`, data)
}
//  单次/周期委托发送/entrust/modify-period-entrust-status
export const apiModifyPeriodEntrustStatus = (data) => {
    return postRequest(`${baseUrl}/entrust/modify-period-entrust-status`, data)
}

//  查询货物信息entrust/get-entrust-cargo/{entrustCode}
export const apiGetEntrustCargo = (data) => {
    return getRequest(`${baseUrl}/entrust/get-entrust-cargo`, data)
}
//  查询基本详情entrust/get-period-entrust-basic-details/{entrustCode}
export const apiGetPeriodEntrustBasicDetails = (data) => {
    return getRequest(
        `${baseUrl}/entrust/get-period-entrust-basic-details`,
        data
    )
}
// 生成子委托信息entrust/generate-entrust-executory/{entrustCode}
export const apiGenerateEntrustExecutory = (data) => {
    return getRequest(`${baseUrl}/entrust/generate-entrust-executory`, data)
}

//  查询周期单次委托详情entrust/get-period-once-entrust-details/{executoryEntrustCode}
export const apiGetPeriodOnceEntrustDetails = (data) => {
    return getRequest(
        `${baseUrl}/entrust/get-period-once-entrust-details`,
        data
    )
}
//  查询子委托详情entrust/get-period-entrust-affiliation/{entrustCode}
export const apiGetPeriodEntrustAffiliation = (data) => {
    return getRequest(`${baseUrl}/entrust/get-period-entrust-affiliation`, data)
}
//  城市/dictionary/get-country
export const apiCityDic = (data) => {
    return getRequest(`${dicbaseUrl}/dictionary/get-country`, data)
}
// 城市下的场所 /station/param/{city}
export const apiChangJing = (data) => {
    return getRequest(`${dicbaseUrl}/station/param`, data)
}

//  查询订单列表/order/get-order-list（供应商）
export const apiGetOrderList = (data) => {
    return postRequest(`${productUrl}/order/get-order-list`, data)
}
//  订单的状态改变order/modify-order-status
export const apiModifyOrderStatus = (data) => {
    return postRequest(`${productUrl}/order/modify-order-status`, data)
}
//  查询订单详情order/get-order-details
export const apiGetOrderDetails = (data) => {
    return getRequest(`${productUrl}/order/get-order-details`, data)
}
//  海关关区
export const apiGetTranslate = (data) => {
    return getRequest(`${dicbaseUrl}/dictionary/translate`, data)
}

//  执行反馈表单查看record/get-execute-feedback
export const apiGetExecuteFeedback = (data) => {
    return postRequest(`${productUrl}/record/get-execute-feedback`, data)
}
//  执行反馈表单保存record/add-execute-feedback
export const apiAddExecuteFeedback = (data) => {
    return postRequest(`${productUrl}/record/add-execute-feedback`, data)
}
//  执行反馈单据查看record/get-bills-data
export const apiGetBillsData = (data) => {
    return postRequest(`${productUrl}/record/get-bills-data`, data)
}
// 本地造数据测试
// export const apiGetBillsData = (data) => {
//     return getRequest(`${jzUrl}/json`, data)
// }
//  执行反馈单据保存record/add-bills-data
export const apiAddBillsData = (data) => {
    return postRequest(`${productUrl}/record/add-bills-data`, data)
}
// 首页
//  freightIndex   货运需求待处理
export const apiFreightIndex = (data) => {
    return postRequest(`${homeUrl}/freightIndex`, data)
}
//  /entrustIndex   物流委托待处理
export const apiEntrustIndex = (data) => {
    return postRequest(`${homeUrl}/entrustIndex`, data)
}
//  /currentEntrustExecutoryNum   当前委托总量
export const apiCurrentEntrustExecutoryNum = (data) => {
    return postRequest(`${homeUrl}/currentEntrustExecutoryNum`, data)
}
//  /planIndex   计划待处理
export const apiPlanIndex = (data) => {
    return postRequest(`${homeUrl}/planIndex`, data)
}
//  /planOrderIndex   待处理订单
export const apiPlanOrderIndex = (data) => {
    return postRequest(`${homeUrl}/planOrderIndex`, data)
}
//  /schemeIndex   待处理方案
export const apiSchemeIndex = (data) => {
    return postRequest(`${homeUrl}/schemeIndex`, data)
}
//  /currentSchemeNum   当前物流通道总量/当前方案总量
export const apiCurrentSchemeNum = (data) => {
    return postRequest(`${homeUrl}/currentSchemeNum`, data)
}
//  /currentFreightNum   当前货运要求总量
export const apiCurrentFreightNum = (data) => {
    return postRequest(`${homeUrl}/currentFreightNum`, data)
}
//  /currentMessageList   当前账户消息内容
export const apiCurrentMessageList = (data) => {
    return postRequest(`${homeUrl}/currentMessageList`, data)
}
//  /getMonthlyData 调度查询委托统计图 - 每月环比
export const apiGetMonthlyData = (data) => {
    return postRequest(`${homeUrl}/getMonthlyData`, data)
}
//  /getQuarterEntrustData 查询委托统计图 - 季度环比
export const apiGetQuarterEntrustData = (data) => {
    return postRequest(`${homeUrl}/getQuarterEntrustData`, data)
}
//  /getWeekData 查询委托统计图 - 周环比
export const apiGetWeekData = (data) => {
    return postRequest(`${homeUrl}/getWeekData`, data)
}
//  /updateCurrentMessageStatus/{messageCode} 修改当前账户消息为已读
export const apiGetUpdateCurrentMessageStatus = (data) => {
    return getRequest(`${homeUrl}/updateCurrentMessageStatus`, data)
}
// 基础平台
//  /app/add 新增应用
export const apiAppAdd = (data) => {
    return postRequest(`${systemUrl}/app/add`, data)
}
//  /app/list 查询应用
export const apiAppList = (data) => {
    return postRequest(`${systemUrl}/app/list`, data)
}
//  /app/edit 修改应用
export const apiAppEdit = (data) => {
    return postRequest(`${systemUrl}/app/edit`, data)
}
//  /app/status 修改应用状态
export const apiAppStatus = (data) => {
    return postRequest(`${systemUrl}/app/status`, data)
}
//  /app/delete/1324531066534215681 删除应用
export const apiAppDelete = (data) => {
    return getRequest(`${systemUrl}/app/delete`, data)
}
//  /menu/add 新增菜单
export const apiMenuAdd = (data) => {
    return postRequest(`${systemUrl}/menu/add`, data)
}
//  /menu/edit 修改菜单
export const apiMenuEdit = (data) => {
    return postRequest(`${systemUrl}/menu/edit`, data)
}
//  /menu/list/1001 查询菜单
export const apiMenuList = (data) => {
    return getRequest(`${systemUrl}/menu/list`, data)
}
//  /menu/delete/1324613884366925825 删除菜单
export const apiMenuDelete = (data) => {
    return getRequest(`${systemUrl}/menu/delete`, data)
}
//  /role/add 新增角色
export const apiRoleAdd = (data) => {
    return postRequest(`${systemUrl}/role/add`, data)
}
//  /edit 修改角色
export const apiRoleEdit = (data) => {
    return postRequest(`${systemUrl}/role/edit`, data)
}
//  /role/status 修改角色状态
export const apiRoleStatus = (data) => {
    return postRequest(`${systemUrl}/role/status`, data)
}
//  /role/list 角色列表分页
export const apiRoleList = (data) => {
    return postRequest(`${systemUrl}/role/list`, data)
}
//  /role/delete/1324915323794427905 删除角色
export const apiRoleDelete = (data) => {
    return getRequest(`${systemUrl}/role/delete`, data)
}
//  /role/roleMenuTreeSelect/1324914733139955714 查询角色下的菜单
export const apiRoleMenuTreeSelect = (data) => {
    return getRequest(`${systemUrl}/role/roleMenuTreeSelect`, data)
}
//  /role/saveRoleMenu 配置菜单保存
export const apiRoleSaveRoleMenu = (data) => {
    return postRequest(`${systemUrl}/role/saveRoleMenu`, data)
}
