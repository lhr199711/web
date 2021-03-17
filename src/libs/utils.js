import { Message } from 'view-design'
import validateRules from './validateRules'
import store from '../store/index.js'
import { apiChangJing } from '@/api/logisticsCommission'

//
/**
 * @param {Array} val: 国家省市区城市集合
 * @description 拿到国家省市区城市下的场所
 * @return {Array}
 */
export const _handelDir = val => {
    return new Promise((resolve) => {
        let code = val[val.length - 1]
        const iscode = val[val.length - 2]
        if (
            iscode === '110000000000' ||
            iscode === '120000000000' ||
            iscode === '500000000000' ||
            iscode === '310000000000'
        ) {
            code = iscode
        }
        apiChangJing({ city: code }).then(({ data }) => {
            const arr = data[0]
            const newArr = arr.map(item => {
                return {
                    value: item.sttnCode,
                    label: item.sttnName
                }
            })
            resolve(newArr)
        })
    })
}

/**
 * @param {Object} obj: 需要深拷贝的数据
 * @description 使用循环+递归实现深拷贝
 * @return {Object}
 */
export const deepClone = obj => {
    const objClone = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === 'object') {
        for (const key in obj) {
            // 去除时间
            if (obj[key] && (typeof obj[key] === 'object' && !(obj[key] instanceof Date))) {
                objClone[key] = deepClone(obj[key])
            } else {
                objClone[key] = obj[key]
            }
        }
    }
    return objClone
}

/**
 * @param {Object} data: 字典里取出来的数据
 * @description 根据字典数据里的rules字段生成校验规则
 * @return {Object}
 */
export const getRules = (data) => {
    const tempRules = []
    // 当不需要校验的时候，返回一个空的校验规则（这里会默认检验必须是string），不然不会触发表单的on-validate事件
    if (!data.rules.length) {
        return [{}]
    }
    for (const rule of data.rules) {
        // iView如果是必填校验，必填校验必须放到校验数组的第一个，不然页面上不显示必填的*标记（原因不明）
        if (rule === 'required') {
            tempRules.unshift(...validateRules[rule](data.label))
        } else {
            tempRules.push(...validateRules[rule](data.label))
        }
    }
    return tempRules
}

/**
 * @param {Object} arr: 数组
 * @description 判断数组里是否有相同的元素
 * @return {Object}
 */
export const isRepeat = (arr) => {
    const map = new Map()
    for (const item of arr) {
        if (map.has(item)) {
            return true
        } else {
            map.set(item, true)
        }
    }
    return false
}

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
    const keysArr1 = Object.keys(obj1)
    const keysArr2 = Object.keys(obj2)
    if (keysArr1.length !== keysArr2.length) return false
    else if (keysArr1.length === 0 && keysArr2.length === 0) return true
    /* eslint-disable-next-line */
    else return !keysArr1.some(key => obj1[key] != obj2[key])
}

/**
 * @param {Number/String} IDCard
 * @description 判断身份证号码是否符合规范 (身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X)
 * @return {Boolean}
 */
export const IDCard = (IDCard) => {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    return reg.test(IDCard)
}

/**
 * @param {Number/String} phone
 * @description 判断判断电话号码
 * @return {Boolean}
 */
export const mobilePhone = (phone) => {
    const reg = /^1[345678]\d{9}$/
    return reg.test(phone)
}

/**
 * @param {arr1,code} 合并后数组，判断去重属性<字符串>
 * @description 数组对象去重
 * @return newArr  去重后数组对象
 * 自查找数组第一层对象
 */
export const duplicateRemove = (arr, code) => {
    let newArr = []
    var obj = {}
    newArr = arr.reduce((item, next) => {
        if (!obj[next[code]]) {
            obj[next[code]] = true
            item.push(next)
        }
        return item
    }, [])
    return newArr
}

export const getAccessToken = () => {
    return window.localStorage.getItem('accessToken')
}

export const getRefreshToken = () => {
    return window.localStorage.getItem('refreshToken')
}

/**
 * @param {String} code: 当前权限编码
 * @description 判断用户是否拥有某功能或某子菜单权限
 * @return {Boolean}
 */
export const hasAuth = (code) => {
    const authCode = window.localStorage.getItem('authCode') || ''
    return !!authCode.match(code)
}

/*
 *@description 清空数据，重新渲染
 */
export const reRender = (vm) => {
    store.dispatch('reRender')
}

/*
 * @param arr {Array} 必填项
 * @description 验证必填项是否全，不全则提示
 * @return {Boolean}
 */
export const isInfoComplete = (arr) => {
    return arr.every(item => {
        if (item === '' || item === undefined) {
            Message.info({
                content: '请补全必填项信息',
                duration: 1.2,
                closable: true
            })
        }
        return item !== '' && item !== undefined
    })
}

/*
 * @param arr {date}  毫秒数
 * @description 将毫秒数的时间转换为如：2018-09-03这种格式
 * @return {date}
 */
export const dateToString = (date) => {
    if (date) {
        var time = new Date(date)
        time = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
        return time
    }
}

/*
 * @param arr {date}  毫秒数
 * @description 将毫秒数的时间转换为如：2018-09-03 12:00这种格式 timestamp
 * @description isDay为true，将毫秒数的时间转换为如：2018-09-03这种格式
 * @return {date}
 */
export const timestampFormat = (date, isDay, cc = '-') => {
    if (date) {
        let time = new Date(date)
        const year = time.getFullYear()
        const month = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : `0${time.getMonth() + 1}`
        const day = time.getDate() > 9 ? time.getDate() : `0${time.getDate()}`
        const hour = time.getHours() > 9 ? time.getHours() : `0${time.getHours()}`
        const min = time.getMinutes() > 9 ? time.getMinutes() : `0${time.getMinutes()}`
        if (isDay) {
            time = `${year}${cc}${month}${cc}${day}`
        } else {
            time = `${year}${cc}${month}${cc}${day} ${hour}:${min}`
        }
        return time
    }
}

/*
 * @param date {date} 2018-09-03 12:00
 * @description 将如：2018-09-03 12:00这种格式转换为毫秒数
 * @return {date}
 */
export const toTimestamp = (date) => {
    if (date) {
        const time = new Date(date)
        return time.getTime()
    }
}

/*
 * @param date {date} 21355
 * @description 将如：44820分钟转换为31天3小时
 * @return {date}
 */
export const toHoursStamp = (StatusMinute) => {
    StatusMinute = parseFloat(StatusMinute)
    const day = parseInt(StatusMinute / 60 / 24)
    const hour = parseInt(StatusMinute / 60 % 24)
    const min = parseInt(StatusMinute % 60)
    StatusMinute = ''
    if (day > 0) {
        StatusMinute += day + '天'
    }
    if (hour > 0) {
        StatusMinute += hour + '小时'
    }
    if (min > 0) {
        StatusMinute += parseFloat(min) + '分钟'
    }
    return StatusMinute
}

export const dateTimeToString = (dateTime) => {
    if (dateTime) {
        const temp = dateTime.split('T')
        return `${temp[0]} ${temp[1].slice(0, 8)}`
    }
}

export const checkSelect = (vm) => {
    if (!~vm.selectRadioIndex) {
        Message.error({
            content: '需选中下列表格中的某一项',
            duration: 1.2,
            closable: true
        })
    }
    return ~vm.selectRadioIndex
}

/*
 * @param tableData {Array}  后台传来的数据
 * @param consts {Array}  前台定义的常量
 * @param changeDate {String}  需要转换的字段
 * @description 将后台传来的没有翻译的字段翻译成字符串 在原有字段添加一个Name
 * @return {Array}
 */
export const conversionConsts = (tableData, consts, changeDate) => {
    for (let i = 0, length1 = tableData.length; i < length1; i++) {
        for (let j = 0, length2 = consts.length; j < length2; j++) {
            if (tableData[i][changeDate] === consts[j].value) {
                const name = changeDate + 'Name'
                tableData[i][name] = consts[j].label
            }
        }
    }
    return tableData
}

/*
 * @param tableData {Array}  表格显示的数据
 * @description 将后台传来的含有null的字段转化为空
 * @return {Array}
 */
export const deleteNull = (tableData) => {
    tableData.forEach(item => {
        for (var key in item) {
            if (!item[key]) {
                item[key] = ''
            }
        }
    })
    return tableData
}

/*
 * @param start/end {Date}
 * @description 检测是否end大于start
 * @return {Boolean}
 */
export const checkTimeRange = (start, end, msg) => {
    if (start && end) {
        const result = new Date(start).getTime() < new Date(end).getTime()
        if (!result) {
            Message.error({
                content: msg || '时间范围有误请修改',
                duration: 1.2,
                closable: true
            })
        }
        return result
    } else {
        Message.error({
            content: '请选择时间',
            duration: 1.2,
            closable: true
        })
    }
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
    const params1 = route1.params || {}
    const params2 = route2.params || {}
    const query1 = route1.query || {}
    const query2 = route2.query || {}
    return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
    let res = {}
    if (list.length === 2) {
        res = getHomeRoute(list)
    } else {
        const index = list.findIndex(item => routeEqual(item, route))
        if (index === list.length - 1) res = list[list.length - 2]
        else res = list[index + 1]
    }
    return res
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
    let i = -1
    const len = routers.length
    let homeRoute = {}
    while (++i < len) {
        const item = routers[i]
        if (item.children && item.children.length) {
            const res = getHomeRoute(item.children, homeName)
            if (res.name) return res
        } else {
            if (item.name === homeName) homeRoute = item
        }
    }
    return homeRoute
}

/**
 * 读取中英文语言文字
 */
export const readLanguage = (language, type) => {
    const lang = {}
    const lanArr = Object.keys(language).map(item => {
        const result = {}
        result[item] = language[item][type]
        return result
    })
    lanArr.forEach(item => {
        Object.assign(lang, item)
    })
    return lang
}

export const trim = function (string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

/*
 * @description 获取存储在localStorage中的某对象的某字段
 * @param: objName {String} 对象名
 * @param: key {String} 字段名
 * @return value
 * example: getStorageInfo('enterprise', 'enterpriseLicense')
 */
export function getStorageInfo (objName, key) {
    let obj = window.localStorage.getItem(objName)
    if (obj) {
        obj = JSON.parse(obj)
        return obj[key]
    }
}

/*
 * @description 合并图片（如果同一个imageType则合并）
 * @param: containerGood {Array} 原始图片混合的数据 [{imageType: xxx, imageList: xxx, id: xxx}, {}]
 * @return {Array} 合并后的格式如下
 * [
 *     {
 *          imageType: xxx,
 *          imageList: [
 *              {imageUrl: xx, ...},
 *              {imageUrl: xx, ...}
 *          ]
 *      },
 *      {
 *          ...
 *      }
 * ]
 */
export function mergeImg (imgList) {
    const map = {}
    const result = []
    imgList.forEach(item => {
        if (!map[item.imageType]) {
            map[item.imageType] = item.imageType
            result.push({
                imageTypeI18nDisplay: item.imageTypeI18nDisplay,
                imageType: item.imageType,
                imageList: [item]
            })
        } else {
            result.forEach(r => {
                if (r.imageType === item.imageType) {
                    r.imageList.push(item)
                }
            })
        }
    })
    return result
}

/*
 * @description 合并图片（将页面上全部图片合并成一个imageList）
 * @param: imageUrls {Array}, imageType: {String} 第一个为图片组件的url，第二个为字典的类型, 第三个为imageResourceId,没有则传false。可传多个这样的组合 arrangeImg(imageUrls, imageType, imageResourceId, imageUrls, imageType, imageResourceId, ...)
 * @return {Array} 合并后的格式如下
 * [
 *     {
 *          imageResourceId,
 *          imageType: xxx,
 *          imageUrls: [
 *              'http:....',
 *              'http:....'
 *          ]
 *      },
 *      {
 *          ...
 *      }
 * ]
 */
export function arrangeImg () {
    const imageList = []
    if (!(arguments.length % 3 === 0)) {
        throw new Error('传入参数有误，参数个数应为3的倍数')
    } else {
        for (let i = 0; i < arguments.length; i++) {
            if (i % 3 === 0) {
                //  照片地址
                const imgObj = {
                    imageType: arguments[i + 1]
                }
                let tempImgUrls = []
                if (arguments[i] && arguments[i].length > 0) {
                    if (arguments[i + 2]) {
                        imgObj.imageResourceId = arguments[i + 2]
                    }
                    arguments[i].forEach(item => {
                        item.imageUrl ? tempImgUrls.push(item.imageUrl) : tempImgUrls = item.imageUrls
                    })
                }
                imgObj.imageUrls = tempImgUrls
                imageList.push(imgObj)
            }
        }
        return imageList
    }
}

/*
 * @param date {date} 传入分钟为单位的时间间隔 如63分钟
 * @description 将如：63转化为1小时3分钟
 * @return {date} 1小时3分钟
 */
export const minuteToHour = (date) => {
    if (date) {
        return Math.floor(date / 60) + '时' + date % 60 + '分'
    }
}
