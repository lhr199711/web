/* 角色类型（调度【DIS】、销售【SALE】、专家【EXPERT】、供应商【SUPP】、企业客户【ENT】）
用户类型（高级【ADV】、普通【GEN】） */

const userType = JSON.parse(window.localStorage.getItem('user')).roles[0]
    .roleType
/* 根据角色判断是否是调度DIS */
export function isDIS () {
    if (userType === 'DIS') {
        return true
    } else {
        return false
    }
}
/* 根据角色判断是否是销售SALE */
export function isSALE () {
    if (userType === 'SALE') {
        return true
    } else {
        return false
    }
}
/* 根据角色判断是否是客户ENT */
export function isENT () {
    if (userType === 'ENT') {
        return true
    } else {
        return false
    }
}
/* 根据角色判断是否是供应商SUPP */
export function isSUPP () {
    if (userType === 'SUPP') {
        return true
    } else {
        return false
    }
}
