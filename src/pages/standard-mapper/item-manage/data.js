export const columns = [
    {
        title: '选择',
        align: 'center',
        type: 'selection',
        width: 60
    },
    {
        title: '数据项编号',
        align: 'center',
        key: 'name'
    },
    {
        title: '数据项名称',
        align: 'center',
        key: 'label'
    },
    {
        title: '控件类型',
        align: 'center',
        key: 'controlTypeTranslate'
    },
    {
        title: '数据来源',
        align: 'center',
        key: 'sourceTranslate'
    },
    {
        title: '数据来源值',
        align: 'center',
        key: 'sourceValue'
    },
    {
        title: '数据类型',
        align: 'center',
        key: 'dataTypeTranslate'
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
        slot: 'action',
        width: 160
    }
]

export const formItem = {
    name: '',
    label: '',
    itemType: '',
    controlType: '',
    dataType: '',
    maxLength: '',
    accuracy: '',
    source: '',
    sourceValue: '',
    note: ''
}
