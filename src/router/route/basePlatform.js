export default [
    {
        path: '/base-platform/user-manage/user-list/:page',
        name: 'user_list',
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
        component: () => import('@/pages/base-platform/user-manage/UserList.vue')
    },
    {
        path: '/base-platform/department-manage/list/:page',
        name: 'department_manage',
        props: (route) => ({
            page: route.params.page
        }),
        meta: {
            name: '部门管理',
            authCode: null
        },
        component: () => import('@/pages/base-platform/department-manage/List.vue')
    }
]
