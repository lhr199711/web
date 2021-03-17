import { postRequest, getRequest } from '../common.js'
import { municationGate as baseUrl } from '../api'

//  /message-record/list 消息分页
export const apiMessageRecordList = (data) => {
    return postRequest(`${baseUrl}/message-record/list`, data)
}
//  /message-record/add 新增消息
export const apiMessageRecordAdd = (data) => {
    return postRequest(`${baseUrl}/message-record/add`, data)
}
//  /message-record/status/1325247818830299138 修改状态
export const apiMessageRecordStatus = (data) => {
    return getRequest(`${baseUrl}/message-record/status/`, data)
}
