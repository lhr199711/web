/* eslint-disable */
import {
    apiGetPeriodEntrustBasicDetails,
    apiModifyPeriodEntrustStatus
} from '@/api/logisticsCommission'
export default {
    data() {
        return {
            // 货物信息列表
            CargoInfoList: [],
        }
    },
    watch: {},
    methods: {
        // 处理一下子组件拿来的货物信息
        cargoInfoItem_m(data) {
            this.CargoInfoList = data
        },
        // 新增的操作
        saveForm_m() {
            this.$refs.formValidate.validate(valid => {
                if (valid) {
                    this._add()
                } else {
                    this.$Message.error('必填项没填!')
                }
            })
        },
        //我是发送委托
        sendTrust_m() {
            let data = {
                entrustCode: this.cptentrustCode, //委托编号
                entrustStatus: 'AFORM' //子委托状态
            }
            apiModifyPeriodEntrustStatus({
                data
            }).then(({ data }) => {
                this.$Message.success('操作成功')
                this.$router.push('/logisstics-commission/one-logistics/1')
            })
        },
    },
}
