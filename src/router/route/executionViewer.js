export default [
    {
        path: '/execution-viewer/:page',
        name: 'execution-viewer',
        meta: {
            name: '执行查看器',
            authCode: null
        },
        component: () => import('@/pages/execution-viewer/Index.vue')
    }
]
