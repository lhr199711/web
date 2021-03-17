export const tableColumns = [
    {
        title: '选择',
        align: 'center',
        type: 'selection',
        width: 80
    },
    {
        title: '合作伙伴名称',
        align: 'center',
        key: 'partnerName'
    },
    {
        title: '代码',
        align: 'center',
        key: 'partnerCode'
    },
    {
        title: '地址',
        align: 'center',
        key: 'partnerAddr'
    },
    {
        title: '电话',
        align: 'center',
        key: 'partnerPhone'
    },
    {
        title: '传真',
        align: 'center',
        key: 'partnerFax'
    },
    {
        title: '邮箱',
        align: 'center',
        key: 'partnerEmail'
    },
    // {
    //     title: '是否上传授权书',
    //     align: 'center',
    //     key: 'updateStatus'
    // },
    {
        title: '操作',
        align: 'center',
        key: 'operating',
        slot: 'action',
        width: '250px'
    }
]
