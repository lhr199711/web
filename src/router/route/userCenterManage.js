export default [
    {
        path: '/user-center-manage/user-manage/:page',
        name: 'user_center_manage',
        props: (route) => ({
            page: route.params.page,
            accountStatus: route.query.accountStatus,
            phoneNumber: route.query.phoneNumber,
            accountName: route.query.accountName
        }),
        meta: {
            name: '用户管理',
            authCode: null
        },
        component: () => import('@/pages/user-center-manage/user-manage/Index.vue')
    },
    {
        path: '/user-center-manage/roles-manage/:page',
        name: 'roles_manage',
        props: true,
        meta: {
            name: '角色管理',
            authCode: null
        },
        component: () => import('@/pages/user-center-manage/roles-manage/Index.vue')
    },
    {
        path: '/user-center-manage/department-manage/:page',
        name: 'user_depart_manage',
        props: (route) => ({
            page: route.params.page
        }),
        meta: {
            name: '组织机构管理',
            authCode: null
        },
        component: () => import('@/pages/user-center-manage/department-manage/Index.vue')
    },
    {
        path: '/user-center-manage/infor-maintenance/:page',
        name: 'infor_maintenance',
        props: (route) => ({
            page: route.params.page,
            partnerName: route.query.partnerName
        }),
        meta: {
            name: '用户信息维护',
            authCode: null
        },
        component: () => import('@/pages/user-center-manage/infor-maintenance/Index.vue')
    }
]
