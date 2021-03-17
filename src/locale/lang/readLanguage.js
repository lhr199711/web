/**
 * 读取中英文语言文字
 */
export default (language, type) => {
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
