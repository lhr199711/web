<template>
    <div>
        <!--  拒绝理由弹框 -->
        <adt-my-modal
            :showModal="dialogOp.showItemModal"
            :title="dialogOp.itemTitle"
            @on-visible-change="visibleChange"
            @on-ok="handleItemModalOk"
        >
            <div class="tit">录入拒绝订单原因</div>
            <div class="ipt">
                <Input
                    v-model="remark"
                    type="textarea"
                    :autosize="{minRows: 2,maxRows: 5}"
                    placeholder="请输入..."
                ></Input>
            </div>
        </adt-my-modal>
    </div>
</template>

<script>
import { apiModifyOrderStatus } from '@/api/logisticsCommission'
export default {
    name: '',
    props: {
        detailData: {
            type: Object,
            default () {
                return {}
            },
        },
    },
    data () {
        return {
            dialogOp: {
                showItemModal: false,
                itemTitle: '录入拒绝订单原因',
            },
            remark: '',
        }
    },
    created () {
    },
    mounted () { },
    methods: {
        // 弹框里面的取消按钮
        visibleChange (data) {
            this.dialogOp.showItemModal = data
        },
        // 弹框里面的确认按钮
        handleItemModalOk () {
            this.dialogOp.showItemModal = false
            this._unacceptDialog()
        },
        // 同意
        accept (obj) {
            let data = {
                planCode: obj.planCode,
                orderCodeList: new Array(obj.orderCode),
                orderStatus: 'RECEIVE',
                // remark
            }
            apiModifyOrderStatus({ data }).then(({ data }) => {
                this.$Message.success('修改成功')
                this.$router.push({
                    path: '/logisstics-commission/orderList/:page',
                })
            })
        },
        // 打开弹框
        openDialog () {
            this.dialogOp.showItemModal = true
        },
        _unacceptDialog () {
            let data = {
                planCode: this.detailData.planCode,
                orderCodeList: new Array(this.detailData.orderCode),
                orderStatus: 'REJECT',
                remark: this.remark,
            }
            apiModifyOrderStatus({ data }).then(({ data }) => {
                this.$Message.success('修改成功')
                this.$router.push({
                    path: '/logisstics-commission/orderList/:page',
                })
            })
        },
    },
}
</script>

<style scoped lang="scss">
</style>
