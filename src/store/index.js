/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import { logisticsCommission } from "./modules/logisticsCommission"

Vue.use(Vuex)

// 根据浏览器语言初始化语言
const navLang = (navigator.language === 'zh-cn' || navigator.language === 'en-us') ? navigator.language : ''
const language = navLang || window.localStorage.getItem('language') || 'zh-cn'

const store = new Vuex.Store({
    state: {
        state: {},
        routerTags: [],
        routerTagName: '',
        nativeTagIndex: -1,
        requestLoading: 0,
        showMainComponent: true,
        canRefresh: true,
        language: language
    },
    mutations,
    actions,
    getters,
    modules: {
        logisticsCommission
    }
})

export default store
