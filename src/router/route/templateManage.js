export default [
    {
        path: '/template-manage/:page',
        name: 'templateManage',
        props: true,
        meta: {
            name: '模版管理',
            authCode: null
        },
        component: () => import('@/pages/template-manage/Index')
    },
    {
        path: '/template-manage/item-manage/:page',
        name: 'itemManage',
        props: true,
        meta: {
            name: '数据项管理',
            authCode: null
        },
        component: () => import('@/pages/template-manage/ItemManage')
    }
]
