export default [
    {
        path: '/standard-mapper/scene-manage/list/:page',
        name: 'scene_manage',
        props: route => ({
            page: route.params.page,
            sceneCode: route.query.sceneCode,
            sceneName: route.query.sceneName,
            serverType: route.query.serverType,
            trspType: route.query.trspType,
            examineStatus: route.query.examineStatus,
            useStatus: route.query.useStatus
        }),
        meta: {
            name: '场景管理列表',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/scene-manage/List.vue')
    },
    {
        path: '/standard-mapper/scene-manage/detail',
        name: 'scene_detail',
        props: route => ({
            sceneCode: route.query.sceneCode
        }),
        meta: {
            name: '场景管理详情',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/scene-manage/Detail.vue')
    },
    {
        path: '/standard-mapper/basics-task/list/:page',
        name: 'basics_task',
        props: route => ({
            page: route.params.page,
            taskCode: route.query.taskCode,
            taskName: route.query.taskName,
            trspType: route.query.trspType,
            examineStatus: route.query.examineStatus,
            useStatus: route.query.useStatus
        }),
        meta: {
            name: '基础任务列表',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/basics-task/List.vue')
    },
    {
        path: '/standard-mapper/basics-task/detail/:taskCode',
        name: 'basics_detail',
        props: true,
        meta: {
            name: '基础任务详情',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/basics-task/Detail.vue')
    },
    {
        path: '/standard-mapper/additional-task/list/:page',
        name: 'additional_task',
        props: route => ({
            page: route.params.page,
            taskCode: route.query.taskCode,
            taskName: route.query.taskName,
            trspType: route.query.trspType,
            examineStatus: route.query.examineStatus,
            useStatus: route.query.useStatus
        }),
        meta: {
            name: '附加任务列表',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/additional-task/List.vue')
    },
    {
        path: '/standard-mapper/additional-task/detail/:taskCode',
        name: 'additional_task_detail',
        props: true,
        meta: {
            name: '附加任务详情',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/additional-task/Detail.vue')
    },
    {
        path: '/standard-mapper/item-manage/list/:page',
        name: 'item_manage',
        props: route => ({
            page: route.params.page,
            label: route.query.label,
            examineStatus: route.query.examineStatus,
            useStatus: route.query.useStatus
        }),
        meta: {
            name: '数据项管理列表',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/item-manage/List.vue')
    },
    {
        path: '/standard-mapper/item-manage/detail/:name',
        name: 'item_manage_detail',
        props: true,
        meta: {
            name: '数据项管理详情',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/item-manage/Detail.vue')
    },
    {
        path: '/drag',
        name: 'drag',
        meta: {
            name: '拖拽',
            authCode: null
        },
        component: () => import('@/pages/drag/Index.vue')
    },
    {
        path: '/standard-mapper/site-manage/list/:page',
        name: 'standard_site_list',
        props: route => ({
            page: route.params.page,
            sttnCode: route.query.sttnCode,
            sttnName: route.query.sttnName,
            country: route.query.country,
            countrys: route.query.countrys,
            province: route.query.province,
            city: route.query.city,
            examineStatus: route.query.examineStatus,
            useStatus: route.query.useStatus
        }),
        meta: {
            name: '场所管理列表',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/site-manage/List.vue')
    },
    {
        path: '/standard-mapper/site-manage/detail',
        name: 'site_detail',
        props: route => ({
            sttnCode: route.query.sttnCode
        }),
        meta: {
            name: '场所管理详情',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/site-manage/Detail.vue')
    },
    {
        path: '/standard-mapper/document-manage/list/:page',
        name: 'document_manage',
        props: route => ({
            page: route.params.page,
            examineStatus: route.query.examineStatus,
            useStatus: route.query.useStatus,
            billsCode: route.query.billsCode,
            billsName: route.query.billsName
        }),
        meta: {
            name: '单据管理列表',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/document-manage/List.vue')
    },
    {
        path: '/standard-mapper/document-manage/detail',
        name: 'document_detail',
        props: route => ({
            billsCode: route.query.billsCode
        }),
        meta: {
            name: '单据管理详情',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/document-manage/Detail.vue')
    },
    {
        path: '/standard-mapper/data-source-manage/list/:page',
        name: 'data_source',
        props: route => ({
            page: route.params.page,
            sourceCode: route.query.sourceCode,
            displayName: route.query.displayName,
            remark: route.query.remark,
            examineStatus: route.query.examineStatus,
            useStatus: route.query.useStatus
        }),
        meta: {
            name: '数据源管理列表',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/data-source-manage/List.vue')
    },
    {
        path: '/standard-mapper/data-source-manage/detail/:name',
        name: 'data_source_detail',
        props: true,
        meta: {
            name: '数据源管理详情',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/data-source-manage/Detail.vue')
    },
    {
        path: '/standard-mapper/unusual-manage/list/:page',
        name: 'unusual',
        props: route => ({
            page: route.params.page,
            label: route.query.label,
            examineStatus: route.query.examineStatus,
            useStatus: route.query.useStatus
        }),
        meta: {
            name: '异常管理列表',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/unusual-manage/List.vue')
    },
    {
        path: '/standard-mapper/unusual-manage/detail/:name',
        name: 'unusual_detail',
        props: true,
        meta: {
            name: '异常管理详情',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/unusual-manage/Detail.vue')
    },
    {
        path: '/standard-mapper/collaboration-manage/list/:page',
        name: 'collaboration',
        props: route => ({
            page: route.params.page,
            label: route.query.label,
            examineStatus: route.query.examineStatus,
            useStatus: route.query.useStatus
        }),
        meta: {
            name: '协同协作管理列表',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/collaboration-manage/List.vue')
    },
    {
        path: '/standard-mapper/collaboration-manage/detail/:name',
        name: 'collaboration_detail',
        props: true,
        meta: {
            name: '协同协作管理详情',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/collaboration-manage/Detail.vue')
    },
    {
        path: '/standard-mapper/message-manage/list/:page',
        name: 'message_list',
        props: route => ({
            page: route.params.page,
            examineStatus: route.query.examineStatus,
            templateStatus: route.query.templateStatus,
            businessType: route.query.businessType,
            messageCode: route.query.messageCode,
            messageName: route.query.messageName
        }),
        meta: {
            name: '消息管理列表',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/message-manage/List.vue')
    },
    {
        path: '/standard-mapper/message-manage/detail',
        name: 'message_detail',
        props: route => ({
            messageCode: route.query.messageCode
        }),
        meta: {
            name: '消息管理详情',
            authCode: null
        },
        component: () => import('@/pages/standard-mapper/message-manage/Detail.vue')
    }
]
