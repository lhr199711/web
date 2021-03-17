import { apiAddBillsData } from '@/api/logisticsCommission'
export default {
    props: {
        // 表单数据
        list: {
            type: Array,
            default () {
                return []
            }
        },
        // 其他数据
        dataObj: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {}
    },
    computed: {
        formValidate () {
            const obj = {}
            const data = this.list
            data.forEach((item) => {
                obj[item.name] = item.value
                if (item.controlType === 'C') {
                    obj[item.name] = item.value.split(',')
                }
            })
            return obj
        },
        verifyValidate () {
            const obj = {}
            const data = this.list
            data.forEach((item) => (obj[item.name] = item.maxLength))
            return obj
        }
    },
    watch: {},
    methods: {
        // 保存单据
        save () {
            const data = {
                billsCode: this.dataObj.billsCode,
                sceneName: this.dataObj.sceneName,
                orderCode: this.dataObj.orderCode,
                dataResult: this._processFormData(this.formValidate, this.list)
            }
            apiAddBillsData({
                data
            }).then((res) => {
                this.$Message.success(res.message)
            })
        },
        _processFormData (newValue, oldValue) {
            const arr = oldValue.map((item) => {
                return {
                    ...item,
                    value: this.isArrVal_m(newValue[item.name])
                        ? newValue[item.name].join(',')
                        : newValue[item.name]
                }
            })
            return arr
        }
    }
}
