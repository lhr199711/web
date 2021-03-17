import { postRequest, getRequest } from './common.js'
import { mould as baseUrl } from './api'

//  分页查询模版信息
export const apiTemplateQuery = (data) => {
    return postRequest(`${baseUrl}/templateBasicClassification/templateBasicClassificationQuery`, data)
}
// 增加模版
export const apiTemplateBasicClassificationAdd = (data) => {
    return postRequest(`${baseUrl}/templateBasicClassification/templateBasicClassificationAdd`, data)
}
// 通过模板编码查询模板信息
export const apiTemplateBasicClassificationQuery = (data) => {
    return getRequest(`${baseUrl}/templateBasicClassification/templateBasicClassificationQuery`, data)
}
// 修改模版
export const apiTemplateBasicClassifitionUpdate = (data) => {
    return postRequest(`${baseUrl}/templateBasicClassification/templateBasicClassifitionUpdate`, data)
}
// 通过模板编码删除模板信息
export const delTemplateBasic = (data) => {
    return getRequest(`${baseUrl}/templateBasicClassification/templateBasicDel`, data)
}
// 分页查询模板关联数据项弹出窗数据项展示信息
export const apiTemplateRelDataQuery = (data) => {
    return postRequest(`${baseUrl}/templateBasicClassification/templateRelDataQuery`, data)
}
// 保存模板与数据项关联信息
export const apiTemplateRelDataAdd = (data) => {
    return postRequest(`${baseUrl}/templateBasicClassification/templateRelDataAdd`, data)
}

// 分页查询数据项基础信息
export const apiTemplateDataQuery = (data) => {
    return postRequest(`${baseUrl}/templateData/templateDataQuery`, data)
}
// 增加模板数据项基本信息
export const apiTemplateDataAdd = (data) => {
    return postRequest(`${baseUrl}/templateData/templateDataAdd`, data)
}
// 通过数据项编码删除数据项信息
export const apiTemplateDataDel = (data) => {
    return getRequest(`${baseUrl}/templateData/templateDataDel`, data)
}
// 通过数据项编码查询数据项基本信息
export const getTemplateDataQuery = (data) => {
    return getRequest(`${baseUrl}/templateData/templateDataQuery`, data)
}
// 修改数据项基本信息
export const apiTemplateDataUpdate = (data) => {
    return postRequest(`${baseUrl}/templateData/templateDataUpdate`, data)
}
