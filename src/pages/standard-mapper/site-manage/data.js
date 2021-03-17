export const tableColumns = [
    {
        title: '选择',
        align: 'center',
        type: 'selection',
        width: 80
    },
    {
        title: '场所编号',
        align: 'center',
        key: 'sttnCode'
    },
    {
        title: '场所名称',
        align: 'center',
        key: 'sttnName'
    },
    {
        title: '场所简称',
        align: 'center',
        key: 'sttnAbbr'
    },
    {
        title: '国家',
        align: 'center',
        key: 'countryTranslate'
    },
    {
        title: '省份',
        align: 'center',
        key: 'provinceTranslate'
    },
    {
        title: '城市',
        align: 'center',
        key: 'cityTranslate'
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
        slot: 'useStatus'
    },
    {
        title: '操作',
        align: 'center',
        key: 'operating',
        slot: 'action',
        width: 180
    }
]
