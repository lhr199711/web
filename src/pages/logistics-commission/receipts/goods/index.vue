<template>
    <div class="receipt-box">
        <div class="dashed-line"></div>
        <div class="name">货物进/出库单Stock IN/OUT List</div>
        <div class="main-box">
            <div class="row flex">
                <div class="text w110">
                    制单时间
                    <br />(Date)
                </div>
                <div class="input">
                    <Input v-model="formValidate.age"></Input>
                </div>
                <div class="text w110">
                    单据号
                    <br />（No.）
                </div>
                <div class="input">
                    <Input></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text" style="width:358px">货物所在仓库详情（Details of warehouse）</div>
                <div class="input">
                    <Input v-model="formValidate.cargo_details_details"></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text w110">
                    订单/发票编号
                    <br />(Contract No.)
                </div>
                <div class="input">
                    <Input v-model="formValidate.age"></Input>
                </div>
                <div class="text w110">
                    进/出库日期
                    <br />(Delivery Date)
                </div>
                <div class="input">
                    <Input></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text w110">
                    运输方式
                    <br />(Delivery Mode)
                </div>
                <div class="input">
                    <Input v-model="formValidate.age"></Input>
                </div>
                <div class="text w110">
                    承运方
                    <br />(Carrier)
                </div>
                <div class="input">
                    <Input></Input>
                </div>
            </div>
            <div class="row node">订单双方信息（Details of Parties）</div>
            <div class="row flex">
                <div class="text w110">
                    货权方
                    <br />(Owner)
                </div>
                <div class="input">
                    <Input v-model="formValidate.age"></Input>
                </div>
                <div class="text w110">
                    接受方
                    <br />(Recipient)
                </div>
                <div class="input">
                    <Input></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text w110">
                    发起人
                    <br />(Initiator)
                </div>
                <div class="input">
                    <Input v-model="formValidate.age"></Input>
                </div>
                <div class="text w110">
                    接货人
                    <br />(Receiver)
                </div>
                <div class="input">
                    <Input></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text w110">
                    地址
                    <br />(Address)
                </div>
                <div class="input">
                    <Input v-model="formValidate.age"></Input>
                </div>
                <div class="text w110">
                    地址
                    <br />(Address)
                </div>
                <div class="input">
                    <Input v-model="formValidate.age"></Input>
                </div>
            </div>
            <div class="row node">发货清单（Cargo List）</div>
            <div class="row flex">
                <div class="text" style="width:60px">序号 No.</div>
                <div class="text flex1">
                    货物名称
                    <br />(Description)
                </div>
                <div class="text flex1">
                    规格
                    <br />(Specification)
                </div>
                <div class="text flex1">
                    单位
                    <br />(Unit)
                </div>
                <div class="text flex1">
                    数量
                    <br />(Quantity)
                </div>
                <div class="text flex1">
                    重量(Weight)/ 体积
                    <br />(Measurement)
                </div>
                <div class="text flex1">
                    库位
                    <br />(Locator)
                </div>
            </div>
            <div class="row flex">
                <div class="text" style="width:60px">1</div>
                <div class="input flex1" v-for="row in 6">
                    <Input v-model="formValidate.unit"></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text" style="width:60px">2</div>
                <div class="input flex1" v-for="row in 6">
                    <Input v-model="formValidate.age"></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text" style="width:169px;">总计（Total Amount）</div>
                <div class="input">
                    <Input v-model="formValidate.age"></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text w110">
                    包装方式
                    <br />(Package type)
                </div>
                <div class="input">
                    <Input v-model="formValidate.age"></Input>
                </div>
                <div class="text w110">
                    结存
                    <br />(Remarks)
                </div>
                <div class="input">
                    <Input v-model="formValidate.age"></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text w110">
                    制单人
                    <br />(Prepared by)
                </div>
                <div class="input">
                    <Input v-model="formValidate.age"></Input>
                </div>
                <div class="text w110">
                    审核人
                    <br />(Auditor)
                </div>
                <div class="input">
                    <Input v-model="formValidate.age"></Input>
                </div>
                <div class="text w110">
                    操作人
                    <br />(Operator)
                </div>
                <div class="input">
                    <Input v-model="formValidate.age"></Input>
                </div>
            </div>
            <div class="row flex">
                <div class="text w110">
                    货权方签章
                    <br />(Supplier SIG.)
                </div>
                <div class="input">
                    <Input v-model="formValidate.age"></Input>
                </div>
                <div class="text w110">
                    承运方签章
                    <br />(Carrier SIG.)
                </div>
                <div class="input">
                    <Input v-model="formValidate.age"></Input>
                </div>
                <div class="text w110">
                    接受方签章
                    <br />(Buyer SIG.)
                </div>
                <div class="input">
                    <Input v-model="formValidate.age"></Input>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { apiAddBillsData } from '@/api/logisticsCommission'
import utilMixin from '../../mixins/utilMixin'
import receipt from '../receipt'
export default {
    name: "goods",
    mixins: [utilMixin, receipt],
    data () {
        return {
        };
    },
    computed: {
    },
    created () {

    },
    mounted () {

    },
    methods: {
    }
};
</script>

<style scoped lang="scss">
@import '../index.scss';
</style>
