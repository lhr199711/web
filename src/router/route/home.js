export default [
    {
        path: '/home',
        name: 'home1',
        props: route => ({
            redirect: route.query.redirect
        }),
        meta: {
            title: '首页',
            authCode: null
        },
        component: () => import('@/pages/home/Home.vue')
    }
]
