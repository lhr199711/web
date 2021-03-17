import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from './lang/zh-CN'
import enUS from './lang/en-US'

Vue.use(VueI18n)

const messages = {
    'zh-cn': zhCN,
    'en-us': enUS
}
const i18n = new VueI18n({
    locale: '',
    messages: messages
})

export default i18n
