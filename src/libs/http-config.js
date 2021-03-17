/* eslint-disable */
// let devBaseUrl = process.env.NODE_ENV === 'development' ?  API_BASE ? API_BASE : 'http://192.168.1.36:8090/api/' : ''
let devBaseUrl = ''
/* eslint-enable */

const CONFIG = {
    testBaseUrl: '/api/',
    devBaseUrl: devBaseUrl,
    proBaseUrl: '/api/'
}

let baseURL = ''
switch (process.env.NODE_ENV) {
case 'production':
    baseURL = CONFIG.proBaseUrl
    break
case 'testing':
    baseURL = CONFIG.testBaseUrl
    break
case 'development':
    baseURL = CONFIG.devBaseUrl
    break
default:
    baseURL = CONFIG.devBaseUrl
}

export default baseURL
