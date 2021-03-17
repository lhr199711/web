export default [
    {
        path: '/authority-manage/user-manage/:page',
        name: 'authority_user_manage',
        props: true,
        meta: {
            name: '用户管理',
            authCode: null
        },
        component: () => import('@/pages/authority-manage/UserManage.vue')
    },
    {
        path: '/authority-manage/organization-manage/:page',
        name: 'organization_manage',
        props: true,
        meta: {
            name: '组织机构管理',
            authCode: null
        },
        component: () => import('@/pages/authority-manage/OrganizationManage.vue')
    },
    {
        path: '/menu-permission',
        name: 'menu-permission',
        meta: {
            name: '菜单权限',
            authCode: null
        },
        component: () => import('@/pages/authority-manage/MenuPermission')
    },
    {
        path: '/role',
        name: 'role',
        meta: {
            name: '岗位角色',
            authCode: null
        },
        component: () => import('@/pages/authority-manage/Role')
    }
]
