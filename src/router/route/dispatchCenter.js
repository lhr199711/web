export default [
    {
        path: '/dispatch-center/dispatching-service-plan/:page',
        name: 'dispatching_service_plan',
        props: true,
        meta: {
            name: '调度匹配的服务方案',
            authCode: null
        },
        component: () => import('@/pages/dispatch-center/DispatchingServicePlan.vue')
    },
    {
        path: '/dispatch-center/dispatch-confirmation-logistics-plan',
        name: 'dispatch_confirmation_logistics_plan',
        props: true,
        meta: {
            name: '调度确认物流服务方案',
            authCode: null
        },
        component: () => import('@/pages/dispatch-center/DispatchConfirmationLogisticsPlan.vue')
    },
    {
        path: '/dispatch-center/dispatch-confirmation-service-provider',
        name: 'dispatch_confirmation_service_provider',
        props: true,
        meta: {
            name: '调度确认方案服务商',
            authCode: null
        },
        component: () => import('@/pages/dispatch-center/DispatchConfirmationServiceProvider.vue')
    },
    {
        path: '/dispatch-center/sales-service-plan/:page',
        name: 'sales_service_plan',
        props: true,
        meta: {
            name: '销售的推荐服务方案',
            authCode: null
        },
        component: () => import('@/pages/dispatch-center/SalesServicePlan.vue')
    },
    {
        path: '/dispatch-center/sales-service-plan-details',
        name: 'sales_service_plan_details',
        props: true,
        meta: {
            name: '销售物流方案详情',
            authCode: null
        },
        component: () => import('@/pages/dispatch-center/SalesServicePlanDetails.vue')
    },
    {
        path: '/dispatch-center/dispatch-logistics-plan/:page',
        name: 'dispatch_logistics_plan',
        props: true,
        meta: {
            name: '物流全程计划调度',
            authCode: null
        },
        component: () => import('@/pages/dispatch-center/DispatchLogisticsPlan.vue')
    }
]
