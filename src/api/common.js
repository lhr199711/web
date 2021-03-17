import http from '@/libs/http'
import { Message } from 'view-design'

/*
 * put, post, patch: 接受路径参数和body参数
 * get, delete: url即了，以后可能会有问号类型的参数
 */

export const wxGetRequest = (url, path = {}, params = {}) => {
    let api = url
    if (path && Object.keys(path)) {
        Object.keys(path).forEach(item => {
            const arr = []
            for (const key in path[item]) {
                arr.push(`${key}=${path[item][key]}`)
            }
            api = api + `?${arr.join('&')}`
        })
    }
    return http.get(api, params).then(res => {
        if (res.code === '200') {
            return res
        } else if (res.code === '30002') {
            throw res
        } else {
            Message.info({ content: res.message })
            throw res
        }
    })
}
export const getRequestValueKey = (url, path = {}, params = {}) => {
    let api = url + '?'
    if (path && Object.keys(path)) {
        Object.keys(path).forEach(item => {
            api = api + `${item}=${path[item]}&`
        })
    }
    return http.get(api, params).then(res => {
        if (res.code === '200') {
            return res
        } else if (res.code === '30002') {
            throw res
        } else {
            Message.info({ content: res.message })
            throw res
        }
    })
}
export const getRequest = (url, path = {}, params = {}) => {
    let api = url
    if (path && Object.keys(path)) {
        Object.keys(path).forEach(item => {
            api = api + `/${path[item]}`
        })
    }
    return http.get(api, params).then(res => {
        if (res.code === '200') {
            return res
        } else if (res.code === '30002') {
            throw res
        } else {
            Message.info({ content: res.message })
            throw res
        }
    })
}

export const postRequest = (url, { path = {}, data = {} } = {}) => {
    let api = url
    if (path && Object.keys(path)) {
        Object.keys(path).forEach(item => {
            api = api + `/${path[item]}`
        })
    }
    return http.post(api, { data: data }).then(res => {
        if (res.code === '200') {
            return res
        } else {
            Message.info({ content: res.message })
            throw res
        }
    })
}

export const putRequest = (url, { path = {}, data = {} } = {}) => {
    let api = url
    if (path && Object.keys(path)) {
        Object.keys(path).forEach(item => {
            api = api + `/${path[item]}`
        })
    }
    return http.put(api, { data: data }).then(res => {
        if (res.code === '200') {
            return res
        } else {
            Message.info({ content: res.message })
            throw res
        }
    })
}

export const patchRequest = (url, { path = {}, data = {} } = {}) => {
    let api = url
    if (path && Object.keys(path)) {
        Object.keys(path).forEach(item => {
            api = api + `/${path[item]}`
        })
    }
    return http.patch(api, { data: data }).then(res => {
        if (res.code === '200') {
            return res
        } else {
            Message.info({ content: res.message })
            throw res
        }
    })
}

export const deleteRequest = (url, path = {}) => {
    let api = url
    if (path && Object.keys(path)) {
        Object.keys(path).forEach(item => {
            api = api + `/${path[item]}`
        })
    }
    return http.delete(api).then(res => {
        if (res.code === '200') {
            return res
        } else {
            Message.info({ content: res.message })
            throw res
        }
    })
}
