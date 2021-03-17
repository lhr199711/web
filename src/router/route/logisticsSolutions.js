export default [
    {
        path: '/logistics-solutions/list/:page',
        name: 'logistics_list',
        props: (route) => ({
            page: route.params.page,
            dispatchCity: route.query.dispatchCity,
            dispatchSite: route.query.dispatchSite,
            destinationCity: route.query.destinationCity,
            destinationSite: route.query.destinationSite,
            trspMode: route.query.trspMode,
            trspType: route.query.trspType,
            cargoType: route.query.cargoType,
            schemeValidity: route.query.schemeValidity,
            contaSource: route.query.contaSource,
            contaSizeType: route.query.contaSizeType
        }),
        meta: {
            name: '服务方案列表',
            authCode: null
        },
        component: () => import('@/pages/logistics-solutions/List.vue')
    },
    {
        path: '/logistics-solutions/customer-service-plan/:page',
        name: 'customer_service_plan',
        props: (route) => ({
            page: route.params.page,
            value: route.query.value,
            sign: route.query.sign
        }),
        meta: {
            name: '推荐服务方案',
            authCode: null
        },
        component: () => import('@/pages/logistics-solutions/CustomerServicePlan.vue')
    },
    {
        path: '/logistics-solutions/scheme-details',
        name: 'scheme_details',
        props: (route) => ({
            logisticsData: route.query.logisticsData
        }),
        meta: {
            name: '物流服务方案详情',
            authCode: null
        },
        component: () => import('@/pages/logistics-solutions/SchemeDetails.vue')
    },
    {
        path: '/logistics-solutions/confirmation-logistics-plan',
        name: 'confirmation_logistics_plan',
        props: (route) => ({
            logisticsData: route.query.logisticsData
        }),
        meta: {
            name: '确认物流服务方案',
            authCode: null
        },
        component: () => import('@/pages/logistics-solutions/ConfirmationLogisticsPlan.vue')
    },
    {
        path: '/logistics-solutions/determine-logistics-solution-service-provider',
        name: 'determine_logistics_solution_service_provider',
        props: (route) => ({
            logisticsData: route.query.logisticsData,
            executoryEntrustCode: route.query.executoryEntrustCode,
            freightReqCode: route.query.freightReqCode,
            logisticsSchemeCode: route.query.logisticsSchemeCode,
            routeList: route.query.routeList
        }),
        meta: {
            name: '确定物流方案服务商',
            authCode: null
        },
        component: () => import('@/pages/logistics-solutions/DetermineLogisticsSolutionServiceProvider.vue')
    }
]
