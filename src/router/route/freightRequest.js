export default [
    {
        path: '/freight-request/user-entry',
        name: 'user_entry',
        props: true,
        meta: {
            name: '用户入口',
            authCode: null
        },
        component: () => import('@/pages/freight-request/UserEntry')
    },
    {
        path: '/freight-request/list-client/:page',
        name: 'freight_request',
        props: true,
        meta: {
            name: '货运要求',
            authCode: null
        },
        component: () => import('@/pages/freight-request/ListClient')
    },
    {
        path: '/freight-request/sale-list/:page',
        name: 'sale_list',
        props: true,
        meta: {
            name: '销售列表',
            authCode: null
        },
        component: () => import('@/pages/freight-request/SaleList')
    },
    {
        path: '/freight-request/dispatch-list/:page',
        name: 'dispatch_list',
        props: true,
        meta: {
            name: '调度列表',
            authCode: null
        },
        component: () => import('@/pages/freight-request/DispatchList')
    },
    {
        path: '/freight-request/feedback-detail/:id',
        name: 'feedback_detail',
        props: (route) => ({
            id: route.params.id,
            sign: route.query.sign
        }),
        meta: {
            name: '货运要求客户已反馈详情',
            authCode: null
        },
        component: () => import('@/pages/freight-request/FeedbackDetail')
    },
    {
        path: '/freight-request/simple-entry',
        name: 'easy_entry',
        props: true,
        meta: {
            name: '录入简易货运要求',
            authCode: null
        },
        component: () => import('@/pages/freight-request/SimpleEntry')
    },
    {
        path: '/freight-request/detail-entry',
        name: 'detailed_entry',
        props: route => ({
            a: route.query.a
        }),
        meta: {
            name: '录入详细货运要求',
            authCode: null
        },
        component: () => import('@/pages/freight-request/DetailEntry')
    },
    {
        path: '/freight-request/sale-entry',
        name: 'sale_entry',
        props: true,
        meta: {
            name: '销售录入',
            authCode: null
        },
        component: () => import('@/pages/freight-request/SaleEntry')
    },
    {
        path: '/freight-request/dispatch-entry',
        name: 'dispatch_entry',
        props: true,
        meta: {
            name: '调度录入',
            authCode: null
        },
        component: () => import('@/pages/freight-request/DispatchEntry')
    },
    {
        path: '/freight-request/sale-to-edit/:id',
        name: 'sale_to_edit',
        props: (route) => ({
            id: route.params.id,
            sign: route.query.sign
        }),
        meta: {
            name: '销售查看客户详情录入',
            authCode: null
        },
        component: () => import('@/pages/freight-request/SaleToEdit')
    },
    {
        path: '/freight-request/dispatch-to-edit/:id',
        name: 'dispatch_to_edit',
        props: (route) => ({
            id: route.params.id,
            sign: route.query.sign
        }),
        meta: {
            name: '调度查看客户和销售详情录入',
            authCode: null
        },
        component: () => import('@/pages/freight-request/DispatchToEdit')
    }
]
