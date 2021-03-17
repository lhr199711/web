export const tableColumns = [
    {
        title: '选择',
        align: 'center',
        type: 'selection',
        width: 80
    },
    {
        title: '场景编号',
        align: 'center',
        key: 'sceneCode'
    },
    {
        title: '场景名称',
        align: 'center',
        key: 'sceneName'
    },
    {
        title: '运输类型',
        align: 'center',
        key: 'trspTypeTranslate'
    },
    {
        title: '服务类型',
        align: 'center',
        key: 'serverTypeTranslate'
    },
    {
        title: '物流类型',
        align: 'center',
        key: 'logisticsTypeTranslate'
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

export const tableColumnsBasicTask = [
    {
        title: '选择',
        align: 'center',
        type: 'selection',
        width: 80
    },
    {
        title: '基础任务名称',
        align: 'center',
        key: 'taskName'
    },
    {
        title: '排序值',
        align: 'center',
        slot: 'sort',
        key: 'sort',
        width: 250
    }
]

export const tableColumnsBasicTaskSort = [
    {
        title: '序号',
        align: 'center',
        type: 'index',
        width: 80
    },
    {
        title: '基础任务名称',
        align: 'center',
        key: 'taskName'
    },
    {
        title: '排序值',
        align: 'center',
        key: 'sort',
        width: 250,
        sortType: 'asc'
    }
]

export const tableColumnsAdditionalTasks = [
    {
        title: '选择',
        align: 'center',
        type: 'selection',
        width: 80
    },
    {
        title: '附加任务名称',
        align: 'center',
        key: 'taskName'
    },
    {
        title: '排序值',
        align: 'center',
        slot: 'sort',
        width: 250,
        sortType: 'asc'
    }
]

export const tableColumnsAdditionalTasksSort = [
    {
        title: '选择',
        align: 'center',
        type: 'index',
        width: 80
    },
    {
        title: '附加任务名称',
        align: 'center',
        key: 'taskName'
    },
    {
        title: '排序值',
        align: 'center',
        key: 'sort',
        width: 250,
        sortType: 'asc'
    }
]

export const tableColumnsDocument = [
    {
        title: '选择',
        align: 'center',
        type: 'selection',
        width: 80
    },
    {
        title: '单据名称',
        align: 'center',
        key: 'blsName'
    },
    {
        title: '排序值',
        align: 'center',
        slot: 'sort',
        width: 250,
        sortType: 'asc'
    }
]

export const tableColumnsDocumentSort = [
    {
        title: '序号',
        align: 'center',
        type: 'index',
        width: 80
    },
    {
        title: '单据名称',
        align: 'center',
        key: 'blsName'
    },
    {
        title: '排序值',
        align: 'center',
        key: 'sort',
        width: 250,
        sortType: 'asc'
    }
]

export const basisColumns = [
    {
        title: '序号',
        align: 'center',
        type: 'index'
    },
    {
        title: '基础任务名称',
        align: 'center',
        key: 'taskName'
    },
    {
        title: '排序值',
        align: 'center',
        key: 'sort'
    }
]

export const attachColumns = [
    {
        title: '序号',
        align: 'center',
        type: 'index'
    },
    {
        title: '附加任务名称',
        align: 'center',
        key: 'taskName'
    },
    {
        title: '排序值',
        align: 'center',
        key: 'sort'
    }
]

export const documentsColumns = [
    {
        title: '序号',
        align: 'center',
        type: 'index'
    },
    {
        title: '单据名称',
        align: 'center',
        key: 'blsName'
    },
    {
        title: '排序值',
        align: 'center',
        key: 'sort'
    }
]
