export const columns = [
    {
        title: '选择',
        align: 'center',
        type: 'selection',
        width: 60
    },
    {
        title: '异常编号',
        align: 'center',
        key: 'sourceCode'
    },
    {
        title: '异常名称',
        align: 'center',
        key: 'sourceName'
    },
    {
        title: '异常解决方案',
        align: 'center',
        key: 'db'
    },
    {
        title: '创建人',
        align: 'center',
        key: 'createBy'
    },
    {
        title: '创建时间',
        align: 'center',
        slot: 'createDatetime'
    },
    {
        title: '审核状态',
        align: 'center',
        slot: 'examineStatus'
    },
    {
        title: '审核时间',
        align: 'center',
        key: 'examineDatetime'
    },
    {
        title: '启用状态',
        align: 'center',
        slot: 'useStatus'
    },
    {
        title: '操作',
        align: 'center',
        slot: 'action',
        width: 150
    }
]
