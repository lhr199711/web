/* eslint-disable */
export default [
    {
        path: '/logisstics-commission/one-logistics/:page',
        name: 'one_logistics',
        props: (route) => ({
            page: route.params.page,
            departurePort: route.query.departurePort,
            destinationPort: route.query.destinationPort,
            trsspmPort: route.query.trsspmPort,
            contractCode: route.query.contractCode
        }),
        meta: {
            name: '单次物流委托列表',
            authCode: null,
        },
        component: () =>
            import('@/pages/logistics-commission/one-logistics/Single.vue'),
    },
    {
        path: '/logisstics-commission/two-logistics/:page',
        name: 'two_logistics',
        props: (route) => ({
            page: route.params.page,
            entrustCode: route.query.entrustCode,
            contractCode: route.query.contractCode,
            cargoType: route.query.cargoType,

        }),
        meta: {
            name: '合同委托列表',
            authCode: null,
        },
        component: () =>
            import('@/pages/logistics-commission/one-logistics/Cycle.vue'),
    },
    {
        path: '/logisstics-commission/add-single',
        name: 'add-single',
        meta: {
            name: '录入单次物流委托',
            authCode: null,
        },
        component: () =>
            import('@/pages/logistics-commission/one-logistics/AddSingle.vue'),
    },
    {
        path: '/logisstics-commission/singleDetail',
        name: 'SingleDetail',
        meta: {
            name: '录入单次物流委托详情',
            authCode: null,
        },
        component: () =>
            import(
                '@/pages/logistics-commission/one-logistics/SingleDetail.vue'
            ),
    },
    {
        path: '/logisstics-commission/edit-one-logistics',
        name: 'EditOneLogistics',
        meta: {
            name: '单次委托编辑',
            authCode: null,
        },
        component: () =>
            import(
                '@/pages/logistics-commission/one-logistics/edit-one-logistics/Index.vue'
            ),
    },
    {
        path: '/logisstics-commission/cycleDetail',
        name: 'CycleDetail',
        meta: {
            name: '录入周期物流委托详情',
            authCode: null,
        },
        component: () =>
            import(
                '@/pages/logistics-commission/one-logistics/CycleDetail.vue'
            ),
    },
    {
        path: '/testHuhai',
        name: 'Test',
        meta: {
            name: '测试',
            authCode: null,
        },
        component: () =>
            import('@/pages/logistics-commission/one-logistics/test.vue'),
    },
    //订单
    {
        path: '/logisstics-commission/orderList/:page',
        name: 'orderList',
        meta: {
            name: '订单列表',
            authCode: null,
        },
        component: () =>
            import('@/pages/logistics-commission/order/index.vue'),
    },
    {
        path: '/logisstics-commission/orderDetail',
        name: 'orderDetail',
        meta: {
            name: '订单详情',
            authCode: null,
        },
        component: () =>
            import('@/pages/logistics-commission/order/detail.vue'),
    },
    {
        path: '/logisstics-commission/home',
        name: 'Home',
        meta: {
            name: '首页',
            authCode: null,
        },
        component: () =>
            import('@/pages/logistics-commission/home/Index.vue'),
    },
    // 基础平台
    {
        path: '/applicationList',
        name: 'ApplicationList',
        meta: {
            name: '应用管理',
            authCode: null,
        },
        component: () =>
            import('@/pages/base-platform/application-manage/applicationList.vue'),
    },
    {
        path: '/menuAdministration',
        name: 'MenuAdministration',
        meta: {
            name: '菜单管理',
            authCode: null,
        },
        component: () =>
            import('@/pages/base-platform/menu-permission/Index.vue'),
    },
    {
        path: '/roleList',
        name: 'RoleList',
        meta: {
            name: '角色管理',
            authCode: null,
        },
        component: () =>
            import('@/pages/base-platform/role-manage/roleList.vue'),
    },
    {
        path: '/newsList',
        name: 'NewsList',
        meta: {
            name: '消息管理',
            authCode: null,
        },
        component: () =>
            import('@/pages/base-platform/news-manage/NewsList.vue'),
    },
]
