import AdtListItem from '@/components/adt-list-item/Index'
import paginator from '@/mixins/paginator'
import validateRules from '@/libs/validateRules'
import { timestampFormat } from '@/libs/utils'
import { apiChangJing } from '@/api/logisticsCommission'
export default {
    mixins: [paginator],
    components: {
        AdtListItem
    },
    data () {
        return {
            // 供应商产品状态
            productStatus: this.$getDictionary('PRODUCT_STATUS'),
            // 一页显示的条数
            size: 6,
            // 清空选中
            resetCheckStatus: false,
            // titleNames: ['运输产品', '场所产品', '关务产品', '综保区产品'],
            titleNames: ['运输产品', '场所产品'],
            // 是否管理员（通过query模拟）
            isManager: this.$isManager,
            // 审核modal显示隐藏
            isExamineModalShow: false,
            // 审核信息
            examineInfo: {},
            // 设置优惠折扣比modal显示隐藏
            isModalShow: false,
            // 取消优惠折扣比modal显示隐藏
            isCancelDiscountModalShow: false,
            // 失效审核：产品已经与方案绑定modal显示隐藏
            isSxModalShow: false,
            // 失效审核：产品已经与方案绑定提升信息
            sxMessage: '',
            // 审核类型：{有效: 1, 失效: 0}
            examineType: 1,
            examineModalTitle: '有效审核',
            // 优惠折扣数据
            discountData: {
                discount: ''
            },
            // 删除modal显示隐藏
            isDeleteModalShow: false,
            ruleValidate: {
                discount: [
                    validateRules.required('优惠折扣比')[0]
                ]
            },
            // 处理过的选中的数据
            requestData: [],
            // 选中的数据
            selectList: [],
            // 删除产品的id
            deleteId: '',
            // 列表数据
            listData: [],
            // 审核同意、不同意
            agree: '1',
            // 不同意驳回原因
            reason: ''
        }
    },
    methods: {
        // 格式化时间
        timestampFormat (timeStamp) {
            return timestampFormat(timeStamp, true)
        },
        // 初始化数据(获取产品列表)
        dataInit () {
            this.getData()
        },
        // 控制状态切换传值
        auditStatus (id) {
            if (this.search.serverStatus === id) {
                this.search.serverStatus = ''
            } else {
                this.search.serverStatus = id
            }
        },
        // 设置优惠折扣比modal显示隐藏切换
        visibleChange (changeStatus) {
            this.isModalShow = changeStatus
        },
        // 取消优惠折扣比modal显示隐藏切换
        cancelDiscountVisibleChange (changeStatus) {
            this.isCancelDiscountModalShow = changeStatus
        },
        // 审核modal显示隐藏切换
        examineVisibleChange (changeStatus) {
            this.isExamineModalShow = changeStatus
        },
        // 失效审核：产品已经与方案绑定modal显示隐藏切换
        sxVisibleChange (changeStatus) {
            this.isSxModalShow = changeStatus
        },
        // 删除modal显示隐藏切换
        deleteVisibleChange (changeStatus) {
            this.isDeleteModalShow = changeStatus
        },
        // 删除
        remove (data) {
            this.deleteId = data.id
        },
        // 确认删除
        confirmDelete () {

        },
        // 设置优惠折扣
        setDiscount (dataSource) {
            const data = this.handleRequestData(dataSource)
            // 批量操作，没有选择产品
            if (!data.length) return
            this.isModalShow = true
        },
        // 取消优惠折扣
        cancelDiscount (dataSource) {
            const data = this.handleRequestData(dataSource)
            // 批量操作，没有选择产品
            if (!data.length) return
            this.isCancelDiscountModalShow = true
        },
        // 确定设置优惠折扣
        confirmSetDiscount (apiPrefPrice) {
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    const discount = Number(this.discountData.discount)
                    if (!discount) {
                        this.$Message.warning('请输入数字！')
                        return
                    }
                    if (discount < 1 || discount > 99) {
                        this.$Message.warning('优惠折扣比要在1~99之间！')
                        return
                    }
                    apiPrefPrice({ data: { serverCodes: this.requestData, prefDiscount: discount } }).then(res => {
                        this.$Message.info(res.message)
                        this.getData()
                    })
                }
            })
        },
        // 确定取消优惠折扣
        confirmCancelDiscount (apiCancelPrefPrice) {
            apiCancelPrefPrice().then(res => {
                this.$Message.info(res.message)
                this.getData()
            })
        },
        // 操作员有效申请、管理员有效
        // dataSource: 批量操作为'',单个操作为产品信息
        // { apiAuditTrue: 有效接口, dataSource: 批量操作为'',单个操作为产品信息, rest: 有效时后端需要的入参（有效、失效是一样的） }
        validApply (apiAuditTrue, dataSource, ...rest) {
            const data = this.handleRequestData(dataSource, ...rest)
            // 批量操作，没有选择产品
            if (!data.length) return
            apiAuditTrue({ data }).then(res => {
                this.$Message.info(res.message)
                this.getData()
            })
        },
        // 操作员失效申请、管理员失效
        // dataSource: 批量操作为'',单个操作为产品信息
        // { apiAuditFalse: 失效接口, dataSource: 批量操作为'',单个操作为产品信息, rest: 失效时后端需要的入参（有效、失效是一样的） }
        invalidApply (apiAuditFalse, dataSource, ...rest) {
            const data = this.handleRequestData(dataSource, ...rest)
            // 批量操作，没有选择产品
            if (!data.length) return
            apiAuditFalse({ data }).then(res => {
                this.$Message.info(res.message)
                this.getData()
            })
        },
        // 将数据处理成ajax请求需要的入参数据
        // { data: 数据, rest: 有效、失效时后端需要的入参（有效、失效是一样的） }
        // rest数据格式： 1、传到后端的参数名和取到的字段名一样，也不需要特殊处理，直接传字符串
        // rest数据格式： 1、传到后端的参数名和取到的字段名不一样，需要特殊处理，传对象，格式如：{ param: '', field: '', handleFun: function() {} }
        handleRequestData (data, ...rest) {
            // 产品这里传到后端的入参默认值
            const params = rest.length ? rest : ['serverCode', 'serverStatus', 'version']
            this.requestData = []
            // 单个操作
            if (data) {
                this.requestData.push(handle(data))
                return this.requestData
            } else {
                // 批量操作
                if (!this.selectList.length) {
                    this.$Message.warning('请先选择产品')
                } else {
                    for (const list of this.selectList) {
                        this.requestData.push(handle(list))
                    }
                }
                return this.requestData
            }
            function handle (obj) {
                const result = {}
                for (const item of params) {
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
        examine (product, ...rest) {
            // 产品这里传到后端的入参默认值
            const params = rest.length ? rest : ['serverCode', 'serverStatus', 'version']
            // 根据状态判断是有效审核
            if (!product.useStatus || product.useStatus.trim() === 'disable') {
                this.examineType = 1
                this.examineModalTitle = '有效审核'
            } else {
                this.examineType = 0
                this.examineModalTitle = '失效审核'
            }
            for (const item of params) {
                this.examineInfo[item] = product[item]
            }
            this.isExamineModalShow = true
        },
        // 确定审核
        examineSave (apiAuditTrueOk, apiAuditTrueNo, apiAuditFalseOk, apiAuditFalseNo) {
            const vm = this
            const data = { ...this.examineInfo }
            // 有效审核
            if (this.examineType === 1) {
                // 同意
                if (this.agree === '1') {
                    apiAuditTrueOk({ data }).then(res => {
                        judgeIsBind(res)
                    })
                } else {
                    if (!this.reason) {
                        this.$Message.warning('请填写不同意原因！')
                        return
                    }
                    data.remark = this.reason
                    // 不同意
                    apiAuditTrueNo({ data }).then(res => {
                        judgeIsBind(res)
                    })
                }
            } else {
                // 失效审核
                // 同意
                if (this.agree === '1') {
                    apiAuditFalseOk({ data }).then(res => {
                        judgeIsBind(res)
                    })
                } else {
                    if (!this.reason) {
                        this.$Message.warning('请填写输入驳回原因！')
                        return
                    }
                    data.remark = this.reason
                    // 不同意
                    apiAuditFalseNo({ data }).then(res => {
                        judgeIsBind(res)
                    })
                }
            }
            function judgeIsBind (res, isAuditFalse) {
                // res.data: {true: 没绑定, false: 已绑定方案}
                // examineType === 0: 失效审核
                // 产品已经与方案绑定
                if (!res.data && vm.examineType === 0) {
                    vm.isSxModalShow = true
                    vm.sxMessage = `产品编号：${data.serverCode} 产品已经与方案绑定，失效申请需要调度审核，确定提交调动审核？`
                } else {
                    vm.$Message.info(res.message)
                    vm.isExamineModalShow = false
                    vm.getData()
                }
            }
        },
        // 确定 失效审核：产品已经与方案绑定
        confirmSx (apiSx) {
            apiSx(this.examineInfo).then(res => {
                this.$Message.info(res.message)
                this.isExamineModalShow = false
                this.isSxModalShow = false
            })
        },
        // 切换列表
        goToOtherProductList (index) {
            switch (index) {
            case 0:
                this.$router.push('/product-editor/transport-list/1')
                break
            case 1:
                this.$router.push('/product-editor/site-list/1')
                break
            case 2:
                this.$router.push('/product-editor/customs-list/1')
                break
            case 3:
                this.$router.push('/product-editor/cpa-list/1')
                break
            }
        },
        // 选择产品
        checkData (data, status) {
            // const curServerCode = data.serverCode
            // 选中
            // if (status) {
            //     this.selectList.push(curServerCode)
            // } else {
            //     // 取消选中
            //     const index = this.selectList.indexOf(curServerCode)
            //     this.selectList.splice(index, 1)
            // }
            // 后端需要多个字段
            if (status) {
                this.selectList.push(data)
            } else {
                // 取消选中
                for (const index in this.selectList) {
                    if (this.selectList[index].serverCode === data.serverCode) {
                        this.selectList.splice(index, 1)
                    }
                }
            }
        },
        // 根据城市获取场所
        _handelDir (val) {
            return new Promise(resolve => {
                const code = val[val.length - 1]
                apiChangJing({ city: code }).then(({ data }) => {
                    const arr = (data && data.length) ? data[0] : []
                    const newArr = arr.map(item => {
                        return {
                            value: item.sttnCode,
                            label: item.sttnName
                        }
                    })
                    resolve(newArr)
                })
            })
        }
    }
}
