export default [
    {
        path: '/logistics-entrust/once-entrust-entering',
        name: 'once-entrust-entering',
        meta: {
            title: '单次委托录入'
        },
        component: () => import('@/pages/logistics-entrust/OnceEntrustEntering.vue')
    },
    {
        path: '/logistics-entrust/contract-entrust-entering',
        name: 'contract-entrust-entering',
        meta: {
            title: '合同委托录入'
        },
        component: () => import('@/pages/logistics-entrust/ContractEntrustEntering.vue')
    },
    {
        path: '/logistics-entrust/single-order-list/:page',
        name: 'single-order-list',
        props: route => ({
            page: route.params.page
        }),
        meta: {
            title: '单次委托查询'
        },
        component: () => import('@/pages/logistics-entrust/SingleOrderList.vue')
    },
    {
        path: '/logistics-entrust/contract-entrust-list/:page',
        name: 'contract-entrust-list',
        props: route => ({
            page: route.params.page
        }),
        meta: {
            title: '合同委托查询'
        },
        component: () => import('@/pages/logistics-entrust/ContractEntrustList.vue')
    },
    {
        path: '/logistics-entrust/whole-plan/view-costm-plan',
        name: 'view_costm_plan',
        meta: {
            title: '查看物流全程计划'
        },
        component: () => import('@/pages/logistics-entrust/whole-plan/ViewCostmPlan.vue')
    }
]
