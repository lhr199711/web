// 后端配置网关后，可以分发接口到对应的端口上，生产环境不需要前缀
// export const permission = process.env.NODE_ENV === 'development' ? process.env.VUE_APP_PERMISSION_API : ''
// export const mould = process.env.NODE_ENV === 'development' ? process.env.VUE_APP_MOULD_API : ''
// export const dictionary = process.env.NODE_ENV === 'development' ? process.env.VUE_APP_DICTIONARY_API : ''

// const isDevelopment = process.env.NODE_ENV === 'development'
const isDevelopment = true

// 后端没有配置网关，生产环境也需要添加前缀
export const permission = isDevelopment ? process.env.VUE_APP_PERMISSION_API : ''
export const entrust = isDevelopment ? process.env.VUE_APP_ENTRUST_API : ''
export const mould = isDevelopment ? process.env.VUE_APP_MOULD_API : ''
export const dictionary = isDevelopment ? process.env.VUE_APP_DICTIONARY_API : ''
export const freight = isDevelopment ? process.env.VUE_APP_FREIGHT_API : ''
export const logistics = isDevelopment ? process.env.VUE_APP_LOGISTICS_API : ''
export const product = isDevelopment ? process.env.VUE_APP_PRODUCT_API : ''
export const login = isDevelopment ? process.env.VUE_APP_LOGIN_API : ''
export const logisticsPlan = isDevelopment ? process.env.VUE_APP_LOGISTICSPLAN_API : ''
export const jz = isDevelopment ? process.env.VUE_APP_JZ_API : ''
export const home = isDevelopment ? process.env.VUE_APP_HOME_API : ''
export const system = 'http://192.168.1.37:13000/permissionGate'
// export const system = isDevelopment ? process.env.VUE_APP_SYSTEM_API : ''
export const municationGate = isDevelopment ? process.env.VUE_APP_MUNICATIONGATE_API : ''
export const userCenter = isDevelopment ? process.env.VUE_APP_USERCENTER_API : ''
