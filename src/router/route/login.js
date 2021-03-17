export default [
    {
        path: '/login',
        name: 'login',
        props: route => ({
            redirect: route.query.redirect
        }),
        meta: {
            name: '登录',
            authCode: null
        },
        component: () => import('@/pages/login/Index.vue')
    }
]
