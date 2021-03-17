export const tableColumns = [
    {
        title: '选择',
        align: 'center',
        type: 'selection',
        width: 80
    },
    {
        title: '用户账号',
        align: 'center',
        key: 'accountName'
    },
    {
        title: '国家区号',
        align: 'center',
        key: 'internationalPhonePrefix'
    },
    {
        title: '手机号码',
        align: 'center',
        key: 'phoneNumber'
    },
    {
        title: '邮箱',
        align: 'center',
        key: 'accountEmail'
    },
    {
        title: '微信号',
        align: 'center',
        key: 'weChat'
    },
    {
        title: '状态',
        align: 'center',
        key: 'accountStatusTranslate'
    },
    {
        title: '创建时间',
        align: 'center',
        key: 'createDatetime'
    },
    {
        title: '操作',
        align: 'center',
        key: 'operating',
        slot: 'action',
        width: '250px'
    }
]
