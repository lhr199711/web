export default [
    {
        path: '/role',
        name: 'role',
        meta: {
            name: '岗位角色',
            authCode: null
        },
        component: () => import('@/pages/role/Index')
    }
]
