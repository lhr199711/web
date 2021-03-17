import paginator from '@/mixins/paginator'
import { timestampFormat } from '@/libs/utils'
export default {
    mixins: [paginator],
    data () {
        return {
            // 启用状态
            enableStatus: this.$getDictionary('ENABLE_STATUS'),
            // 审核状态
            auditStatus: this.$getDictionary('AUDIT_STATUS'),
            // 是否管理员
            isManager: this.$isManager,
            // 新增、编辑modal是否展示
            isModalShow: false,
            // 新增、编辑modal的title
            modalTitle: '',
            // 审核modal是否展示
            isExamineModalShow: false,
            // 审核modal的title
            examineModalTitle: '',
            // 删除modal是否展示
            isActionDel: false,
            // 审核类型：{启用: 1, 停用: 0}
            examineType: 1,
            // 审核信息
            examineInfo: {},
            // 审核同意、不同意
            agree: '1',
            // 不同意驳回原因
            reason: '',
            // 新增编辑区分  true为新增 false为编辑
            isAdd: true,
            // 删除信息
            delInfo: {},
            // 选中的值
            selectionList: [],
            // 编辑不能修改的字段
            editField: ''
        }
    },
    methods: {
        // 格式化时间
        timestampFormat (timeStamp) {
            return timestampFormat(timeStamp)
        },
        // 选择审核状态
        chooseExamineStatus (id) {
            // 取消选中
            if (this.search.examineStatus === id) {
                this.search.examineStatus = ''
            } else {
                this.search.examineStatus = id
            }
        },
        // 选择启用状态
        chooseUseStatus (id) {
            // 取消选中
            if (this.search.useStatus === id) {
                this.search.useStatus = ''
            } else {
                this.search.useStatus = id
            }
        },
        // 选择表格数据
        selectionChange (selectionList) {
            this.selectionList = selectionList
        },
        // 新增、编辑modal显示隐藏切换
        addVisibleChange (changeStatus) {
            this.isModalShow = changeStatus
        },
        // 审核modal显示隐藏切换
        examineVisibleChange (changeStatus) {
            this.isExamineModalShow = changeStatus
        },
        // 删除modal显示隐藏切换
        visibleChange (changeStatus) {
            this.isActionDel = changeStatus
        },
        // 点击查询调用查询接口
        dataInit () {
            this.getData()
        },
        // 新增
        add () {
            this.isModalShow = true
            this.modalTitle = `新增${this.name}`
            this.isAdd = true
        },
        // 取消新增
        cancel () {
            this.$refs.formItemData.resetFields()
        },
        // 删除
        // { row: 数据信息, field: 删除时后端需要的入参, reson: 删除原因字段名 }
        // field数据格式：如果只有一个参数：可以传字符串或者数组格式，如果有多个参数，需要传数组格式
        remove (row, field, reson = 'removeRsn') {
            this.isActionDel = true
            // 是字符串格式
            if (typeof field === 'string') {
                this.delInfo[field] = row[field]
            } else {
                // 是数组格式
                for (const item of field) {
                    this.delInfo[item] = row[item]
                }
            }
            this.delInfo[reson] = ''
        },
        // 确认删除
        confirmDel (apiDel) {
            apiDel({ data: this.delInfo }).then(res => {
                this.$Message.info(res.message)
                // 隐藏模态框
                this.isActionDel = false
                // 重新获取列表数据
                this.getData()
            })
        },
        // 操作员启用申请、管理员启用
        // { apiDisable: 启用接口, dataSource: 批量操作为'',单个操作为产品信息, rest: 启用时后端需要的入参（启用、停用是一样的） }
        startUsing (apiEnable, dataSource, ...rest) {
            const data = this.handleRequestData(dataSource, ...rest)
            // 批量操作，没有选择数据源
            if (!data.length) return
            apiEnable({ data }).then(res => {
                this.$Message.info(res.message)
                this.getData()
            })
        },
        // 操作员停用申请、管理员停用
        // { apiDisable: 停用接口, dataSource: 批量操作为'',单个操作为产品信息, rest: 停用时后端需要的入参（启用、停用是一样的） }
        stopUsing (apiDisable, dataSource, ...rest) {
            const data = this.handleRequestData(dataSource, ...rest)
            // 批量操作，没有选择数据源
            if (!data.length) return
            apiDisable({ data }).then(res => {
                this.$Message.info(res.message)
                this.getData()
            })
        },
        // 将启用、停用的数据处理成ajax请求需要的入参格式
        // { data: 数据, rest: 启用、停用时后端需要的入参（启用、停用是一样的） }
        // rest数据格式： 1、传到后端的参数名和取到的字段名一样，也不需要特殊处理，直接传字符串
        // rest数据格式： 1、传到后端的参数名和取到的字段名不一样，需要特殊处理，传对象，格式如：{ param: '', field: '', handleFun: function() {} }
        handleRequestData (data, ...rest) {
            const requestData = []
            // 单个启用、停用
            if (data) {
                requestData.push(handle(data))
                return requestData
            } else {
                // 批量启用、停用
                if (!this.selectionList.length) {
                    this.$Message.warning(`请先选择${this.name}`)
                } else {
                    for (const list of this.selectionList) {
                        requestData.push(handle(list))
                    }
                }
                return requestData
            }
            function handle (obj) {
                const result = {}
                for (const item of rest) {
                    // 字符串格式
                    if (typeof item === 'string') {
                        result[item] = obj[item]
                    } else {
                        // 对象格式
                        result[item.param] = item.handleFun ? item.handleFun(obj[item.field]) : obj[item.field]
                    }
                }
                return result
            }
        },
        // 审核
        // { row: 数据信息, rest: 审核时后端需要的入参 }
        examine (row, ...rest) {
            // 根据状态判断是启用审核
            if (!row.useStatus || row.useStatus === 'disable') {
                this.examineType = 1
                this.examineModalTitle = '启用审核'
            } else {
                this.examineType = 0
                this.examineModalTitle = '停用审核'
            }
            for (const item of rest) {
                this.examineInfo[item] = row[item]
            }
            this.isExamineModalShow = true
        },
        // 确认审核
        // { apiEnableExamPass: 启用同意api, apiEnableExamFail: 启用不同意api, apiDisableExamPass: 停用同意api, apiDisableExamFail: 停用不同意api }
        examineSave (apiEnableExamPass, apiEnableExamFail, apiDisableExamPass, apiDisableExamFail) {
            const data = { ...this.examineInfo }
            // 启用审核
            if (this.examineType === 1) {
                // 同意
                if (this.agree === '1') {
                    apiEnableExamPass({ data }).then(res => {
                        this.$Message.info(res.message)
                        this.isExamineModalShow = false
                        this.getData()
                    })
                } else {
                    if (!this.reason) {
                        this.$Message.warning('请填写驳回原因！')
                        return
                    }
                    data.message = this.reason
                    // 不同意
                    apiEnableExamFail({ data }).then(res => {
                        this.$Message.info(res.message)
                        this.isExamineModalShow = false
                        this.getData()
                    })
                }
            } else {
                // 停用审核
                // 同意
                if (this.agree === '1') {
                    apiDisableExamPass({ data }).then(res => {
                        this.$Message.info(res.message)
                        this.isExamineModalShow = false
                        this.getData()
                    })
                } else {
                    if (!this.reason) {
                        this.$Message.warning('请填写驳回原因！')
                        return
                    }
                    data.examineRsn = this.reason
                    // 不同意
                    apiDisableExamFail({ data }).then(res => {
                        this.$Message.info(res.message)
                        this.isExamineModalShow = false
                        this.getData()
                    })
                }
            }
        }
    }
}
