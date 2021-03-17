import { postRequest, getRequest } from '../common'
import { mould as baseUrl } from '../api'

// 分页查询数据源基础信息
export const apiQueryDataSource = data => {
    return postRequest(`${baseUrl}/datasource/query-list`, data)
}
// 新增数据源
export const apiAddDataSource = data => {
    return postRequest(`${baseUrl}/datasource/add`, data)
}
// 数据源启用、数据源启用申请
export const apiEnableDataSource = data => {
    return postRequest(`${baseUrl}/datasource/enable`, data)
}
// 数据源停用、数据源停用申请
export const apiDisableDataSource = data => {
    return postRequest(`${baseUrl}/datasource/disable`, data)
}
// 数据源启用审核通过
export const apiEnableExamPassDataSource = data => {
    return postRequest(`${baseUrl}/datasource/enable-exam-pass`, data)
}
// 数据源启用审核不通过
export const apiEnableExamFailDataSource = data => {
    return postRequest(`${baseUrl}/datasource/enable-exam-fail`, data)
}
// 数据源停用审核通过
export const apiDisableExamPassDataSource = data => {
    return postRequest(`${baseUrl}/datasource/disable-exam-pass`, data)
}
// 数据源停用审核不通过
export const apiDisableExamFailDataSource = data => {
    return postRequest(`${baseUrl}/datasource/disable-exam-fail`, data)
}
// 数据源编辑
export const apiModifyDataSource = data => {
    return postRequest(`${baseUrl}/datasource/query-detail-modify`, data)
}
// 数据源删除
export const apiDelDataSource = data => {
    return postRequest(`${baseUrl}/datasource/del`, data)
}
// 通过数据源类型查询表
export const apiGetTableBySourceType = data => {
    return getRequest(`${baseUrl}/datasource/table`, data)
}
// 通过表名查询所有字段和描述
export const apiGetTableFieldByTable = data => {
    return getRequest(`${baseUrl}/datasource/table-field`, data)
}
// 查询所有场景(数据源类型为执行)
export const apiGetSceneList = data => {
    return getRequest(`${baseUrl}/datasource/scene-list`, data)
}
// 查询场景下的所有任务
export const apiGetSceneTask = data => {
    return postRequest(`${baseUrl}/datasource/scene-task`, data)
}
// 查询任务下的数据项
export const apiGetTaskData = data => {
    return getRequest(`${baseUrl}/datasource/task-data`, data)
}
