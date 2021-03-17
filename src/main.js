import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Ann from './common'
import store from './store'
import i18n from './locale'
import { hasAuth, reRender } from './libs/utils'
import iView from 'view-design'
import './my-theme/index.less'
import echarts from 'echarts'
// 挂载
Vue.prototype.$echarts = echarts
// 打印依赖
// import Print from 'vue-print-nb'

// 修改Date的toJSON方法
// eslint-disable-next-line
Date.prototype.toJSON = function () {
    return +new Date(this)
}

Vue.prototype.bus = new Vue()
i18n.locale = store.state.language
// iview国际化
Vue.locale = () => {}
Object.defineProperties(Vue.prototype, {
    $hasAuth: {
        get () {
            return hasAuth
        }
    },
    $reRender: {
        get () {
            return reRender
        }
    },
    $baseUrl: {
        get () {
            return process.env.VUE_APP_API
        }
    },
    // 获取字典
    $getDictionary: {
        get () {
            const getDictionary = (key) => {
                if (!key) {
                    return
                }
                const localDictionary = window.localStorage.getItem(
                    'dictionary'
                )
                return JSON.parse(localDictionary)[key] || []
            }
            return getDictionary
        }
    },
    // 获取用户信息
    $getUserInfo: {
        get () {
            return getUserInfo
        }
    },
    // 判断是否是管理员还是操作员
    // 由于判断的地方比较多，所以扩展到了Vue原型上，方便后续更改（不推荐所有方法属性的都在Vue原型上扩展）
    $isManager: {
        get () {
            return getUserInfo().accountType === 'ADV'
        }
    }
})

const getUserInfo = () => {
    const localUserInfo = JSON.parse(window.localStorage.getItem('user'))
    return {
        // { 'ADV': '高级', 'GEN': '普通' }
        accountType: localUserInfo ? localUserInfo.accountType : '',
        // { 'DIS': '调度', 'SALE': '销售', 'EXPERT': '专家', 'SUPP': '供应商', 'ENT': '企业客户' }
        roleType: localUserInfo ? localUserInfo.roleType : ''
    }
}

// 阻止启动生产消息
Vue.config.productionTip = false

// 捕获error
// eslint-disable-next-line
// Vue.config.errorHandler = function (err, vm, info) {
//     console.error(err)
// }

// 捕获warning
// eslint-disable-next-line
// Vue.config.warnHandler = function(msg, vm, trace) {
//     console.warn(`Warn: ${msg}\nTrace: ${trace}`)
// }

Vue.use(Ann)
Vue.use(iView, {
    // vue 跟 i18n之间的兼容问题
    i18n: function (path, options) {
        const value = i18n.t(path, options)
        if (value !== null && value !== undefined) {
            return value
        }
        return ''
    },
    // i18n: (key, value) => i18n.t(key, value),
    transfer: true
})
// Vue.use(VueWebsocket, 'ws://121.40.165.18:8800')

// export const SocketInstance = socketio('ws://121.40.165.18:8800');
// Vue.use(VueSocketIO, SocketInstance)

// Vue.use(Print)

new Vue({
    router,
    i18n,
    store,
    render: (h) => h(App)
}).$mount('#app')
