import { postRequest, getRequest, getRequestValueKey } from './common'
import { dictionary as baseUrl } from './api'

//  查询所有字典类型列表
export const apiDictionaryTypeQueryList = (data) => {
    return postRequest(`${baseUrl}/dictionaryType/dictionaryTypeQueryList`, data)
}

//  新增字典类型信息
export const apiDictionaryTypeAdd = (path) => {
    return postRequest(`${baseUrl}/dictionaryType/dictionaryTypeAdd`, path)
}

//  删除字典类型
export const apiDictionaryTypeDelete = (data) => {
    return getRequest(`${baseUrl}/dictionaryType/dictionaryTypeDelete`, data)
}

//  根据KEY删除字典类型信息
export const apiDictionaryTypeDeleteByKey = (data) => {
    return getRequest(`${baseUrl}/dictionaryType/dictionaryTypeDeleteByKey`, data)
}

//  根据字典类型ID查询字典类型列表
export const apiDictionaryTypeQueryById = (data) => {
    return getRequest(`${baseUrl}/dictionaryType/dictionaryTypeQueryById`, data)
}

//  根据字典类型KEY查询字典类型列表
export const apiDictionaryTypeQueryByKey = (data) => {
    return getRequest(`${baseUrl}/dictionaryType/dictionaryTypeQueryByKey`, data)
}

//  修改字典类型信息
export const apiDictionaryTypeUpdate = (data) => {
    return postRequest(`${baseUrl}/dictionaryType/dictionaryTypeUpdate`, data)
}

//  添加字典
export const apiDictionaryAdd = (data) => {
    return postRequest(`${baseUrl}/dictionary/dictionaryAdd`, data)
}

//  删除字典
export const apiDictionaryDeleteById = (data) => {
    return postRequest(`${baseUrl}/dictionary/dictionaryDeleteByIds`, data)
}

//  删除类型下所有字典集
export const apiDictionaryDeleteByTypeKey = (data) => {
    return getRequest(`${baseUrl}/dictionary/dictionaryDeleteByTypeKey`, data)
}

//  根据字典类型KEY与字典KEY删除某个字典信息
export const apiDictionaryDeleteByTypeKeyAndKey = (data) => {
    return postRequest(`${baseUrl}/dictionary/dictionaryDeleteByTypeKeyAndKey`, data)
}

//  根据ID查询字典
export const apiDictionaryQueryById = (data) => {
    return getRequest(`${baseUrl}/dictionary/dictionaryQueryById`, data)
}

//  根据KEY查询字典
export const apiDictionaryQueryByKey = (data) => {
    return postRequest(`${baseUrl}/dictionary/dictionaryQueryByKey`, data)
}

//  查询字典类型下所有字典(返回集合)
export const apiDictionaryQueryListByKey = (data) => {
    return getRequest(`${baseUrl}/dictionary/dictionaryQueryListByKey`, data)
}

//  分页查询字典列表（字典key与字典类型为参数）
export const apiDictionaryQueryListByKeyAndType = (data) => {
    return postRequest(`${baseUrl}/dictionary/dictionaryQueryListByKeyAndType`, data)
}

//  修改字典信息
export const apiDictionaryUpdate = (data) => {
    return postRequest(`${baseUrl}/dictionary/dictionaryUpdate`, data)
}

// 根据字典类型从缓存获取翻译
export const apiDictionaryQueryByCacheTypeKey = (data) => {
    return getRequest(`${baseUrl}/dictionaryCommonality/dictionaryQueryByCacheTypeKey`, data)
}

// 获取所有字典类型下的所有字典
export const apiDictionaryQueryAll = (data) => {
    return getRequest(`${baseUrl}/dictionaryCommonality/dictionaryQueryAll`, data)
}

// 清除缓存
export const apiClearCache = (data) => {
    return postRequest(`${baseUrl}/dictionaryCommonality/dictionaryAddRedisByType`, data)
}

// 地理编码
export const apiGetLocation = (data) => {
    return getRequestValueKey('baiduApi/', data)
}
