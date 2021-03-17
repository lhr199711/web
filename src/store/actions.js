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

const setState = ({ commit }, data) => {
    commit(SET_STATE, data)
}

const deleteTags = ({ commit }, index) => {
    commit(DELETE_TAGS, index)
}

const addTags = ({ commit }, router) => {
    commit(ADD_TAGS, router)
}

const resetTags = ({ commit }) => {
    commit(RESET_TAGS)
}

const setNativeTagIndex = ({ commit }, nativeTags) => {
    commit(SET_NATIVE_TAG_INDEX, nativeTags)
}

const setRequestLoading = ({ commit }, status) => {
    commit(SET_RESQUEST_LOADING, status)
}

const reRender = ({ commit }) => {
    commit(RE_RENDER)
}

const setDraft = ({ commit }, content) => {
    commit(SET_DRAFT, content)
}

const clearDraft = ({ commit }) => {
    commit(CLEAR_DRAFT)
}

const setRefresh = ({ commit }, canRefresh) => {
    commit(SET_REFRESH, canRefresh)
}

const setLanguage = ({ commit }, language) => {
    commit(SET_LANGUAGE, language)
}

export default {
    deleteTags,
    addTags,
    resetTags,
    setNativeTagIndex,
    setRequestLoading,
    reRender,
    setDraft,
    clearDraft,
    setRefresh,
    setLanguage,
    setState
}
