import { postRequest, getRequest } from '../common'
import { mould as baseUrl } from '../api'

// 新增场景页面初始化接口（初始化基础任务、附加任务、单据【暂无延后】、场景（共生场景、互斥场景共用））
export const apiInitSceneAdd = (data) => {
    return postRequest(`${baseUrl}/scene/init-scene-add`, data)
}
// 新增场景保存
export const apiAdd = (data) => {
    return postRequest(`${baseUrl}/scene/add`, data)
}
// 编辑场景保存
export const apiEditSave = (data) => {
    return postRequest(`${baseUrl}/scene/modify`, data)
}
// 编辑场景获取数据
export const apiSceneDetail = (data) => {
    return getRequest(`${baseUrl}/scene/sceneDetail/`, data)
}
// 分页查询场景列表信息
export const apiQueryPage = (data) => {
    return postRequest(`${baseUrl}/scene/query-page`, data)
}
// 启用场景
export const apiEnable = (data) => {
    return postRequest(`${baseUrl}/scene/enable`, data)
}
// 禁用场景
export const apiDisable = (data) => {
    return postRequest(`${baseUrl}/scene/disable`, data)
}
// 启用审核通过
export const apiExamEnablePass = (data) => {
    return postRequest(`${baseUrl}/scene/enable-exam-pass`, data)
}
// 启用审核不通过
export const apiExamEnableFail = (data) => {
    return postRequest(`${baseUrl}/scene/enable-exam-fail`, data)
}
// 禁用审核通过
export const apiExamDisablePass = (data) => {
    return postRequest(`${baseUrl}/scene/disable-exam-pass`, data)
}
// 禁用审核不通过
export const apiExamDisableFail = (data) => {
    return postRequest(`${baseUrl}/scene/disable-exam-fail`, data)
}
// 查询基础任务
export const apiQueryTaskBase = (data) => {
    return postRequest(`${baseUrl}/scene/add/query-task-base`, data)
}
// 查询附加任务
export const apiQueryTaskAffix = (data) => {
    return postRequest(`${baseUrl}/scene/add/query-task-affix`, data)
}
// 基础单据
export const apiQueryBillsData = (data) => {
    return postRequest(`${baseUrl}/scene/add/query-bills-data`, data)
}
// 查看详情
export const apiQueryEnableData = (data) => {
    return getRequest(`${baseUrl}/scene/query-detail`, data)
}
// 删除
export const apiQueryDel = (data) => {
    return postRequest(`${baseUrl}/scene/del`, data)
}
// 获取编辑互斥共生场景
export const apiQueryScene = (data) => {
    return getRequest(`${baseUrl}/scene/modify/query-scene`, data)
}
