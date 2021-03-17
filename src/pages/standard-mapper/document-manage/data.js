export const tableColumns = [
    {
        title: '选择',
        align: 'center',
        type: 'selection',
        width: 80
    },
    {
        title: '单据编号',
        align: 'center',
        key: 'billsCode'
    },
    {
        title: '单据名称',
        align: 'center',
        key: 'billsName'
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
        title: '审核时间',
        align: 'center',
        key: 'examineDatetime'
    },
    {
        title: '审核状态',
        align: 'center',
        slot: 'examineStatus'
    },
    {
        title: '启用状态',
        align: 'center',
        slot: 'useStatus'
    },
    {
        title: '操作',
        align: 'center',
        key: 'operating',
        slot: 'action'
    }
]

export const basisColumns = [
    {
        title: '序号',
        align: 'center',
        type: 'index',
        width: 80
    },
    {
        title: '数据项名称',
        align: 'center',
        key: 'label'
    }
]

export const dataItemColumns = [
    {
        title: '选择',
        align: 'center',
        type: 'selection',
        width: 80
    },
    {
        title: '数据项名称',
        align: 'center',
        key: 'label'
    }
]
