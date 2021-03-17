export const tableColumns = [
    {
        title: '选择',
        align: 'center',
        type: 'selection',
        width: 80
    },
    {
        title: '消息编号',
        align: 'center',
        key: 'messageCode'
    },
    {
        title: '消息名称',
        align: 'center',
        key: 'messageName'
    },
    {
        title: '业务环节',
        align: 'center',
        key: 'businessTypeTranslate'
    },
    {
        title: '创建人',
        align: 'center',
        key: 'createByTranslate'
    },
    {
        title: '创建时间',
        align: 'center',
        key: 'createDatetime'
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
        slot: 'templateStatus'
    },
    {
        title: '操作',
        align: 'center',
        key: 'operating',
        slot: 'action',
        width: 180
    }
]
