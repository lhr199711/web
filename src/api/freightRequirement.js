import { postRequest } from './common'
import { freight as baseUrl, mould } from './api'

// 生成路线
export const apiGenerateRoute = (data) => {
    return postRequest(`${baseUrl}/generate/route`, data)
}

// 录入货运要求
export const apiEnterOperationFreight = (data) => {
    return postRequest(`${baseUrl}/operation-freight/enter`, data)
}

// 获取附加任务
export const apiGetSceneAffix = (data) => {
    return postRequest(`${mould}/scene-affix/get`, data)
}
