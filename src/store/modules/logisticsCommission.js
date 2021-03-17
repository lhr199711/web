/* eslint-disable */
const state = {
    Irregular: {},
    PlanData: {},
    noBack: {},
    userInfo: {},
    LawCallback: {}
}

const actions = {
    // setUser ({commit}, newUser) {
    //   console.log('STORE ACTION setUser: ', newUser)
    //   commit(types.SET_USER, newUser)
    // },
}

const mutations = {
    //添加非规律的成功返回
    citIrregular(state, data) {
        state.Irregular = data
    },
    //方案过来的信息
    conmitPlanData(state, data) {
        state.PlanData = data
    },
    // 规律的基本信息调用成功返回
    commitLawCallback(state, data) {
        state.LawCallback = data
    },
    //非规律基本信息的返回
    conmitnoBack(state, data) {
        state.noBack = data
    },
    // eslint-disable-next-line
    // 存用户信息
    setUserInfo(state, data) {
        state.userInfo = data
    }
}

const getters = {
    Irregular: (state) => state.Irregular,
    PlanData: (state) => state.PlanData,
    LawCallback: (state) => state.LawCallback,
    noBack: (state) => state.noBack,
    userInfo: (state) => state.userInfo
}

export const logisticsCommission = {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}
