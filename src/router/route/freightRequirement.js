export default [
    {
        path: '/freight-requirement/list/:page',
        name: 'freight-list',
        props: route => ({
            page: route.params.page
        }),
        meta: {
            title: '货运要求查询'
        },
        component: () => import('@/pages/freight-requirement/List.vue')
    },
    {
        path: '/freight-requirement/freight-requirement-entering',
        name: 'freight-requirement-entering',
        meta: {
            title: '货运要求录入'
        },
        component: () => import('@/pages/freight-requirement/FreightRequirementEntering.vue')
    }
]
