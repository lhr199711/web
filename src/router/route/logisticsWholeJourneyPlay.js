export default [
    {
        path: '/logistics-whole-journey-plan/generate',
        name: 'generate',
        props: (route) => ({
            entrustCode: route.query.entrustCode,
            executoryEntrustCode: route.query.executoryEntrustCode
        }),
        meta: {
            name: '物流全程计划生成',
            authCode: null
        },
        component: () => import('@/pages/logistics-whole-journey-plan/Generate')
    },
    {
        path: '/logistics-whole-journey-plan/client-plan',
        name: 'client_plan',
        props: (route) => ({
            entrustCode: route.query.entrustCode,
            entrustExecutoryStatus: route.query.entrustExecutoryStatus,
            planCode: route.query.planCode
        }),
        meta: {
            name: '客户',
            authCode: null
        },
        component: () => import('@/pages/logistics-whole-journey-plan/ClientPlan')
    },
    {
        path: '/logistics-whole-journey-plan/plan-detail',
        name: 'plan_detail',
        props: (route) => ({
            planCode: route.query.planCode
        }),
        meta: {
            name: '调度查看详情',
            authCode: null
        },
        component: () => import('@/pages/logistics-whole-journey-plan/PlanDetail')
    },
    {
        path: '/logistics-whole-journey-plan/sale-plan-detail',
        name: 'sale_plan_detail',
        props: (route) => ({
            planCode: route.query.planCode
        }),
        meta: {
            name: '销售查看详情',
            authCode: null
        },
        component: () => import('@/pages/logistics-whole-journey-plan/SalePlanDetail')
    }
]
