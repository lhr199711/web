import { postRequest, getRequest } from './common'
import { entrust as baseUrl } from './api'

// 获取合同物流委托列表 客户
export const apiQueryEntContractEntrustList = (data) => { // /entrust/get-period-entrust-list
    return postRequest(`${baseUrl}/entrust/get-role-ent-entrust-list`, data)
}
// 获取合同物流委托列表 调度
export const apiQueryDisContractEntrustList = (data) => {
    return postRequest(`${baseUrl}/entrust/get-role-dis-entrust-list`, data)
}
// 获取合同物流委托列表 销售
export const apiQuerySaleContractEntrustList = (data) => {
    return postRequest(`${baseUrl}/entrust/get-role-sale-entrust-list`, data)
}
// 获取合同物流委托 基础信息详情
export const apiGetPeriodBaseDetails = (data) => {
    return getRequest(`${baseUrl}/entrust/get-period-entrust-base-details`, data)
}
// 获取合同物流委托 下面单次个数
export const apiGetPeriodOnceNumber = (data) => {
    return getRequest(`${baseUrl}/entrust/get-period-once-entrust`, data)
}
// 获取合同物流委托 下面单次详情
export const apiGetPeriodOnceDetail = (data) => {
    return getRequest(`${baseUrl}/entrust/get-period-once-entrust-details`, data)
}
// 获取单次物流委托列表 客户
export const apiQueryEntSingleOrderList = (data) => {
    return postRequest(`${baseUrl}/entrust/get-role-ent-once-entrust-list`, data)
}
// 获取单次物流委托列表 调度
export const apiQueryDisSingleOrderList = (data) => {
    return postRequest(`${baseUrl}/entrust/get-role-dis-once-entrust-list`, data)
}
// 获取单次物流委托列表 销售
export const apiQuerySaleSingleOrderList = (data) => {
    return postRequest(`${baseUrl}/entrust/get-role-sale-once-entrust-list`, data)
}
// 获取单次物流委托 详情
export const apiGetOnceEntrustDetails = (data) => {
    return getRequest(`${baseUrl}/entrust/get-once-entrust-details`, data)
}
// 新增单次物流委托
export const apiAddSingleOrder = (data) => {
    return postRequest(`${baseUrl}/entrust/add-once-entrust`, data)
}
// 修改单次物流委托
export const apiUpSingleOrder = (data) => {
    // {version:'版本号(number)',entrust:'委托编号(string)',executoryEntrustCode:'待执行委托号(string)',...}
    return postRequest(`${baseUrl}/entrust/modify-once-entrust`, data)
}
// ------------------修改单次物流委托 单次 状态 start-------------------------
export const apiUpSendOnce = (data) => { // 发送单次委托
    return postRequest(`${baseUrl}/entrustExecutory/send-once-entrust`, data)
}
export const apiUpRefuseOnce = (data) => { // 拒绝单次委托
    return postRequest(`${baseUrl}/entrustExecutory/refuse-once-entrust`, data)
}
export const apiUpAcceptOnce = (data) => { // 接受单次委托
    return postRequest(`${baseUrl}/entrustExecutory/accept-once-entrust`, data)
}
export const apiUpGenPlanOnce = (data) => { // 单次委托计划生成中
    return postRequest(`${baseUrl}/entrustExecutory/generate-plan-once-entrust`, data)
}
export const apiUpSendPlanOnce = (data) => { // 单次委托计划已推送
    return postRequest(`${baseUrl}/entrustExecutory/send-plan-once-entrust`, data)
}
export const apiUpWaitOnce = (data) => { // 单次委托待货好
    return postRequest(`${baseUrl}/entrustExecutory/wait-cargo-once-entrust`, data)
}
export const apiUpUnderwayOnce = (data) => { // 单次委托进行中
    return postRequest(`${baseUrl}/entrustExecutory/underway-once-entrust`, data)
}
export const apiUpExUnderwayOnce = (data) => { // 单次委托异常进行中
    return postRequest(`${baseUrl}/entrustExecutory/exception-underway-once-entrust`, data)
}
export const apiUpFinishOnce = (data) => { // 单次委托异常结束
    return postRequest(`${baseUrl}/entrustExecutory/exception-finish-once-entrust`, data)
}
export const apiUpAccomplishOnce = (data) => { // 单次委托已完成
    return postRequest(`${baseUrl}/entrustExecutory/accomplish-once-entrust`, data)
}
export const apiUpVclrOnce = (data) => { // 单次委托已核销
    return postRequest(`${baseUrl}/entrustExecutory/vclr-once-entrust`, data)
}
export const apiUpCancelOnce = (data) => { // 单次委托取消
    return postRequest(`${baseUrl}/entrustExecutory/cancel-once-entrust`, data)
}
// -----------------修改单次物流委托 单次 状态 end --------------------------
// 新增合同委托物流委托
export const apiAddperiodEntrustBase = (data) => {
    return postRequest(`${baseUrl}/entrust/add-period-entrust-basic`, data)
}
// 修改合同物流委托 基本信息
export const apiUpPeriodEntrustBase = (data) => {
    // {version:'版本号(number)',entrust:'委托编号(string)',...}
    return postRequest(`${baseUrl}/entrust/modify-period-entrust-base`, data)
}
// ------------------修改合同物流委托 合同 状态 start -------------------------
export const apiUpSendEntrust = (data) => { // 发送合同委托
    return postRequest(`${baseUrl}/entrust/send-period-entrust`, data)
}
export const apiUpRefuseEntrust = (data) => { // 合同委托拒绝
    return postRequest(`${baseUrl}/entrust/refuse-period-entrust`, data)
}
export const apiUpAcceptEntrust = (data) => { // 合同委托接受
    return postRequest(`${baseUrl}/entrust/accept-period-entrust`, data)
}
export const apiUpCancelEntrust = (data) => { // 合同委托取消
    return postRequest(`${baseUrl}/entrust/cancel-period-entrust`, data)
}
// -----------------修改合同物流委托 合同 状态 end --------------------------
// 新增合同物流委托下的规律单次委托
export const apiAddperiodOnceEntrust = (data) => {
    return postRequest(`${baseUrl}/entrust/add-period-once-entrust`, data)
}
// 规律合同委托触发拆分成单次委托
export const apiAddGeneratePeriodEntrust = (data) => {
    return getRequest(`${baseUrl}/entrust/generate-period-entrust`, data)
}
// 修改合同物流委托下 单次委托信息
export const apiUpPeriodEntrustOnce = (data) => {
    // {version:'版本号(number)',entrust:'委托编号(string)',executoryEntrustCode:'待执行委托号(string)',...}
    return postRequest(`${baseUrl}/entrust/modify-period-once-entrust`, data)
}
// 查询货物列表信息接口 供下拉列表选择
export const apiGetEntrustCargo = (data) => {
    return getRequest(`${baseUrl}/entrust/get-entrust-cargo`, data)
}
// 删除单次物流委托
export const apiDeleteOnceEntrust = (data) => {
    // /entrust/delete-once-entrust/{entrustCode}/{executoryEntrustCode}
    return getRequest(`${baseUrl}/entrust/delete-once-entrust`, data)
}
// 删除合同物流委托
export const apiDeletePeriodEntrust = (data) => {
    // /entrust/delete-period-entrust/{entrustCode}
    return getRequest(`${baseUrl}/entrust/delete-period-entrust`, data)
}
