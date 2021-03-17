export default [
    {
        path: '/registered',
        name: 'registered',
        meta: {
            name: '注册',
            authCode: null
        },
        component: () => import('@/pages/registered/Index.vue')
    }
]
