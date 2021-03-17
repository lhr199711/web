export const columns = [
    {
        title: '选择',
        align: 'center',
        type: 'selection',
        width: 60
    },
    {
        title: '数据源编号',
        align: 'center',
        key: 'sourceCode'
    },
    {
        title: '数据源名称',
        align: 'center',
        key: 'displayName'
    },
    {
        title: '创建人',
        align: 'center',
        key: 'createByTranslate'
    },
    {
        title: '创建时间',
        align: 'center',
        slot: 'createDatetime',
        width: 160
    },
    {
        title: '备注',
        align: 'center',
        key: 'remark',
        tooltip: true
    },
    {
        title: '审核状态',
        align: 'center',
        slot: 'examineStatus'
    },
    {
        title: '审核时间',
        align: 'center',
        slot: 'examineDatetime',
        width: 160
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

export const dbColumns = [
    {
        title: '选择',
        align: 'center',
        type: 'selection',
        width: 60
    },
    {
        title: '数据库字段',
        align: 'center',
        key: 'columnName'
    },
    {
        title: '字段显示名称',
        align: 'center',
        slot: 'displayName',
        width: 180
    }
]
