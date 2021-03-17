import {
    DELETE_TAGS,
    ADD_TAGS,
    RESET_TAGS,
    SET_NATIVE_TAG_INDEX,
    SET_RESQUEST_LOADING,
    RE_RENDER,
    SET_DRAFT,
    CLEAR_DRAFT,
    SET_REFRESH,
    SET_LANGUAGE,
    SET_STATE
} from './mutation-types'

// eslint-disable-next-line
import Vue from 'vue'

const mutations = {
    [SET_STATE] (state, data) {
        const keys = Object.keys(data.curUniteParams)
        Vue.set(state.state, [data.key], { uniteParams: data.uniteParams })
        // 满足条件将其他模板的值改变后，如果影响条件的参数又发生了变化，被影响模板的数据项要变回到默认数据项
        if (
            data.relevancyData === 'useDefaultData' ||
            data.templateName === 'useDefaultData'
        ) {
            Vue.set(state.state, [data.key], {
                relevancyData: data.relevancyData,
                templateName: data.templateName,
                uniteParams: data.uniteParams
            })
        }
        for (const key of keys) {
            if (!data.uniteParams[key]) return
        }
        Vue.set(state.state, [data.key], {
            relevancyData: data.relevancyData,
            templateName: data.templateName,
            uniteParams: data.uniteParams
        })
    },

    [DELETE_TAGS] (state, index) {
        // 判断删除的是否是当前页面
        if (state.nativeTagIndex === index) {
            state.nativeTagIndex = index - 1
        } else {
            if (state.nativeTagIndex > index) {
                state.nativeTagIndex -= 1
            }
        }
        state.routerTags.splice(index, 1)
    },

    [ADD_TAGS] (state, router) {
        if (!router.url) {
            return
        }
        // 判断是否已有
        let has = false
        state.routerTags.forEach((item) => {
            if (item.url === router.url) {
                has = true
            }
        })
        if (!has) {
            // 判断是否需要先删除前面的
            const container = document.getElementById('tag-container')
            const content = document.getElementById('tag-content')
            if (
                container &&
                content &&
                container.offsetWidth - content.offsetWidth < 120
            ) {
                // 需要删除前面一个：删除第二个，如果第二个是激活状态则删除第三个
                if (state.nativeTagIndex === 1) {
                    state.routerTags.splice(2, 1)
                } else {
                    state.routerTags.splice(1, 1)
                }
            }
            state.routerTags.push(router)
        }
    },

    [RESET_TAGS] (state) {
        state.routerTags = []
    },

    [SET_NATIVE_TAG_INDEX] (state, router) {
        state.routerTags.forEach((item, index) => {
            if (item.url === router.url) {
                state.nativeTagIndex = index
                window.localStorage.setItem('nativeTagIndex', index)
            }
        })
    },

    [SET_RESQUEST_LOADING] (state, status) {
        if (status === 0) {
            // 出错时重置
            state.requestLoading = 0
        } else {
            state.requestLoading = status
                ? ++state.requestLoading
                : --state.requestLoading
        }
    },

    [RE_RENDER] (state) {
        state.showMainComponent = !state.showMainComponent
    },

    [SET_DRAFT] (state, content) {
        state.draftBox = content
    },

    [CLEAR_DRAFT] (state) {
        state.draftBox = {}
    },

    [SET_REFRESH] (state, canRefresh) {
        state.canRefresh = canRefresh
    },

    [SET_LANGUAGE] (state, language) {
        state.language = language
        window.localStorage.setItem('language', language)
    },

    // 获取点击的菜单
    addTags (state, data) {
        state.routerTags = data
    },

    // 点击的菜单名称
    routerTagName (state, data) {
        state.routerTagName = data
    }
}

export default mutations
