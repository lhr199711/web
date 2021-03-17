export default [
    // 客户
    {
        path: '/logistics-plan/customer/list/:page',
        name: 'customer_logistics_list',
        props: (route) => ({
            page: route.params.page
        }),
        meta: {
            name: '客户方案列表',
            authCode: null
        },
        component: () => import('@/pages/logistics-plan/customer/List.vue')
    },
    {
        path: '/logistics-plan/customer/recommended-plan-list/:page',
        name: 'customer_logistics_recommended_plan_list',
        props: (route) => ({
            page: route.params.page
        }),
        meta: {
            name: '客户推荐方案列表',
            authCode: null
        },
        component: () => import('@/pages/logistics-plan/customer/RecommendedPlanList.vue')
    },
    {
        path: '/logistics-plan/customer/detail',
        name: 'customer_logistics_detail',
        props: true,
        meta: {
            name: '方案详情',
            authCode: null
        },
        component: () => import('@/pages/logistics-plan/customer/Detail.vue')
    },
    // 调度
    {
        path: '/logistics-plan/dispatch/detail',
        name: 'dispatch_logistics_detail',
        props: true,
        meta: {
            name: '方案详情',
            authCode: null
        },
        component: () => import('@/pages/logistics-plan/dispatch/Detail.vue')
    },
    {
        path: '/logistics-plan/dispatch/edit',
        name: 'dispatch_logistics_edit',
        props: true,
        meta: {
            name: '方案编辑',
            authCode: null
        },
        component: () => import('@/pages/logistics-plan/dispatch/Edit.vue')
    },
    // 销售
    {
        path: '/logistics-plan/sales/view-plan-match-list/:page',
        name: 'view_plan_match_list',
        props: (route) => ({
            page: route.params.page
        }),
        meta: {
            name: '查看物流方案匹配',
            authCode: null
        },
        component: () => import('@/pages/logistics-plan/sales/ViewPlanMatchList.vue')
    },
    {
        path: '/logistics-plan/sales/view-plan-nomatch-list/:page',
        name: 'view_plan_nomatch_list',
        props: (route) => ({
            page: route.params.page
        }),
        meta: {
            name: '查看物流方案未匹配',
            authCode: null
        },
        component: () => import('@/pages/logistics-plan/sales/ViewPlanNomatchList.vue')
    }
]
