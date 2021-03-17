export default [
    {
        path: '/dictionary-manage/dictionary/:page',
        name: 'dictionary',
        props: true,
        meta: {
            name: '字典',
            authCode: null
        },
        component: () => import('@/pages/dictionary-manage/Dictionary.vue')
    },
    {
        path: '/dictionary-manage/dictionary-type/:page',
        name: 'dictionary_type',
        props: true,
        meta: {
            name: '字典类型',
            authCode: null
        },
        component: () => import('@/pages/dictionary-manage/DictionaryType.vue')
    }
]
