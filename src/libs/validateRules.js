import i18n from '@/locale'
import store from '../store'

// 该js文件会先于main.js执行
i18n.locale = store.state.language

export default {
    telephone () {
        return [
            { pattern: /^(\d{3,4}-)\d{7,8}$/, message: i18n.t('rules.telephoneRule'), trigger: 'change' }
        ]
    },
    phone () {
        return [
            // { pattern: /^1([38][0-9]|4[5-9]|5[0-3,5-9]|66|7[0-8]|9[89])[0-9]{8}$/, message: i18n.t('rules.phoneRule'), trigger: 'change' }
            { pattern: /^1[3456789]\d{9}$/, message: i18n.t('rules.phoneRule'), trigger: 'change' }
        ]
    },
    email () {
        return [
            { pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: i18n.t('rules.emailRule'), trigger: 'change' }
        ]
    },
    chinese () {
        return [
            { pattern: /^[\u4e00-\u9fa5]{2,4}$/, message: i18n.t('rules.chineseRule'), trigger: 'change' }
        ]
    },
    english () {
        return [
            { pattern: /^[A-Za-z]+$/, message: i18n.t('rules.englishRule'), trigger: 'change' }
        ]
    },
    number () {
        return [
            { type: 'number', message: i18n.t('rules.numberRule'), trigger: 'change' }
        ]
    },
    requiredNumber () {
        return [
            { required: true, type: 'number', message: i18n.t('rules.numberRule'), trigger: 'change' }
        ]
    },
    positiveInteger () {
        return [
            { pattern: /^\+?[1-9][0-9]*$/, message: i18n.t('rules.positiveIntegerRule'), trigger: 'change' }
        ]
    },
    englishNumber () {
        return [
            { pattern: /^[A-Za-z0-9]+$/, message: i18n.t('rules.englishNumberRule'), trigger: 'change' }
        ]
    },
    requiredEnglishNumber () {
        return [
            { required: true, pattern: /^[A-Za-z0-9]+$/, message: i18n.t('rules.englishNumberRule'), trigger: 'change' }
        ]
    },
    decimal (index) {
        return [
            { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/, message: i18n.t('rules.decimalRule'), trigger: 'change' }
        ]
    },
    minMultipleChoice (type = '数据') {
        return [
            { required: true, type: 'array', message: `${i18n.t('rules.tickRule')}${type}`, trigger: 'change' }
        ]
    },
    maxMultipleChoice (type, index) {
        return [
            { type: 'array', max: index, message: `${i18n.t('rules.mostTickRule')}${index}个${type}`, trigger: 'change' }
        ]
    },
    select (type) {
        return [
            { required: true, message: `${i18n.t('rules.selectRule')}${type}`, trigger: 'change' }
        ]
    },
    idCard () {
        return [
            { pattern: /^\d{17}(\d|X|x)/, message: i18n.t('rules.idCardRule'), trigger: 'change' }
        ]
    },
    required (type) {
        return [
            { required: true, message: `${i18n.t('rules.enterRule')}${type}`, trigger: 'change' }
        ]
    },
    maxNum (txt, maxNumber) {
        return [
            { max: maxNumber, message: `${txt}长度不能超过${maxNumber}`, trigger: 'change' }
        ]
    },
    validateTime (rule, value, callback) {
        if (Array.isArray(value)) {
            // 格式为：daterange、datetimerange检测
            value.map(function (item) {
                if (item === '') {
                    return callback(new Error('日期不能为空'))
                }
            })
        } else {
            // 格式为：date、datetime、year、month 检测
            if (value === '') {
                return callback(new Error('日期不能为空'))
            }
        }
        return callback()
    }
}
