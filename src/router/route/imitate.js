
export default [
    {
        path: '/imitate',
        name: 'imitate',
        meta: {
            name: '模拟数据',
            authCode: null
        },
        component: () => import('@/pages/imitate/index.vue')
    }, {
        path: '/inputTest',
        name: 'input_test',
        meta: {
            name: '测试',
            authCode: null
        },
        component: () => import('@/pages/input-test/Index.vue')
    }, {
        path: '/websocket',
        name: 'websocket',
        meta: {
            name: '测试websocket',
            authCode: null
        },
        component: () => import('@/pages/websocket/Index.vue')
    }
]
