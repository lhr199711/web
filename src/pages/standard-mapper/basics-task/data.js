export const basicTaskColumns = [
    {
        title: '选择',
        align: 'center',
        type: 'selection',
        width: 60
    },
    {
        title: '基础任务编号',
        align: 'center',
        key: 'taskCode'
    },
    {
        title: '基础任务名称',
        align: 'center',
        key: 'taskName'
    },
    {
        title: '物流类型',
        align: 'center',
        key: 'logisticsTypeTranslate'
    },
    {
        title: '运输类型',
        align: 'center',
        key: 'trspTypeTranslate'
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

export const additionalTaskColummns = [
    {
        title: '选择',
        align: 'center',
        type: 'selection',
        width: 60
    },
    {
        title: '附加任务编号',
        align: 'center',
        key: 'taskCode'
    },
    {
        title: '附加任务名称',
        align: 'center',
        key: 'taskName'
    },
    {
        title: '物流类型',
        align: 'center',
        key: 'logisticsTypeTranslate'
    },
    {
        title: '运输类型',
        align: 'center',
        key: 'trspTypeTranslate'
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
    taskName: '',
    logisticsType: '',
    trspType: ''
}

export const itemColumns = [
    {
        title: '选择',
        align: 'center',
        type: 'selection',
        width: 60
    },
    {
        title: '数据项编码',
        align: 'center',
        key: 'dataCode'
    },
    {
        title: '数据项名称',
        align: 'center',
        key: 'dataName'
    },
    {
        title: '排序值',
        align: 'center',
        slot: 'sort'
    },
    {
        title: '关联数据项',
        align: 'center',
        slot: 'relationData'
    },
    {
        title: '是否多条数据',
        align: 'center',
        slot: 'isMore'
    },
    {
        title: '是否可编辑',
        align: 'center',
        slot: 'isEdit'
    },
    {
        title: '是否展示',
        align: 'center',
        slot: 'isShow'
    },
    {
        title: '校验规则',
        align: 'center',
        slot: 'rules'
    },
    {
        title: '操作',
        align: 'center',
        slot: 'action',
        width: 120
    }
]

export const previewColumns = [
    {
        title: '序号',
        align: 'center',
        type: 'index'
    },
    {
        title: '数据项名称',
        align: 'center',
        key: 'dataName'
    },
    {
        title: '排序值',
        align: 'center',
        key: 'sort',
        sortType: 'asc'
    }
]
