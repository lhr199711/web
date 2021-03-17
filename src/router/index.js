import Vue from 'vue'
import Router from 'vue-router'
import routes from './route/index'
import iView from 'view-design'
import { hasAuth } from '@/libs/utils'
// eslint-disable-next-line
import { apiDictionaryQueryAll } from '@/api/dictionary'

Vue.use(Router)

const router = new Router({
    routes,
    mode: 'history',
    base: '/'
})

// 解决分页点击报错router-link
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
}

// 不需要登录可访问的页面name
// const OPEN_PAGE_LIST = ['login', 'map_home']

// // 开始进度条
// if (!JSON.parse(window.localStorage.getItem('dictionary'))) {
//     apiDictionaryQueryAll().then(res => {
//         if (res.data) {
//             // 将字典存到本地，方便后续获取
//             window.localStorage.setItem('dictionary', JSON.stringify(res.data))
//             // next()
//         } else {
//             iView.Message.error({ content: '无法获取字典，请联系管理员' })
//         }
//     }).catch(() => {
//         iView.Message.error({ content: '无法获取字典，请联系管理员' })
//     })
// }

router.beforeEach((to, from, next) => {
    // 开始进度条
    iView.LoadingBar.start()
    // token: 判断登录有没有过期
    const [token, hasDictionary] = [window.localStorage.getItem('accessToken'), window.localStorage.getItem('dictionary')]
    // 不需要登录就可以访问的页面
    // if (~OPEN_PAGE_LIST.indexOf(to.name)) {
    // 开发阶段全都不需要登录就可进入
    // eslint-disable-next-line
    if (true) {
        // 有字典，直接进入页面
        if (hasDictionary) {
            next()
        } else {
            next()
            // 没有字典，先获取字典（有的不需要登录的页面可能用到了字典，所以所有页面进入之前都要先获取字典）
            // apiDictionaryQueryAll().then(res => {
            //     if (res.data) {
            //         // 将字典存到本地，方便后续获取
            //         window.localStorage.setItem('dictionary', JSON.stringify(res.data))
            //         next()
            //     } else {
            //         iView.Message.error({ content: '无法获取字典，请联系管理员' })
            //     }
            // }).catch(() => {
            //     iView.Message.error({ content: '无法获取字典，请联系管理员' })
            // })
        }
    } else {
        // 必须登录才可以访问的页面
        if (token) {
            // 判断有没有权限
            if (to.meta.authCode === null || hasAuth(to.meta.authCode)) {
                next()
            } else {
                iView.Message.error({ content: '暂无相关权限，请联系管理员' })
            }
        } else {
            // 跳转到登录页面
            // redirect: 用户直接打开某个页面，但是该页面需要登录才能访问，将该页面的路由带到登录页面，登录成功后，返回到该页面
            const redirect = encodeURIComponent(to.path)
            next({
                name: 'login',
                query: {
                    redirect: redirect
                }
            })
        }
    }
    // eslint-disable-next-line
    document.title = to.meta && to.meta.title || '安道通'
})

router.afterEach(to => {
    // 结束进度条
    iView.LoadingBar.finish()
    // 回到页面顶部
    window.scrollTo(0, 0)
})

export default router
