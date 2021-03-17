<template>
    <div class="public-table-cart-boxjz">
        <div class="card-item" v-for="(cart,index) in tableList" :key="index">
            <div class="cart-itemjz">
                <div class="title">
                    <div class="l">
                        <span>单次委托编号：{{ cart.executoryEntrustCode }}</span>
                        <span>{{ cart.entrustStatusTranslate }}</span>
                    </div>
                    <div class="r">
                        <Dropdown>
                            <span style="cursor: pointer;">查看详情</span>
                            <Icon type="ios-arrow-down"></Icon>
                            <DropdownMenu slot="list">
                                <DropdownItem>
                                    <span @click="seeDetail(cart)">查看详情</span>
                                </DropdownItem>
                                <!-- <DropdownItem>
                                    <span @click="editHandel(cart)">编辑</span>
                                </DropdownItem> -->
                                <!-- <DropdownItem v-permission="['DIS']" v-if="cart.entrustStatus=='RECEIVE' && !cart.planCode">
                                    <span @click="addPlan(cart)">生成全程物流计划</span>
                                </DropdownItem>-->
                                <DropdownItem
                                    v-if="cart.entrustStatus=='RECEIVE' && !cart.planCode && isRoles_m(['DIS'])"
                                >
                                    <span @click="addPlan(cart)">生成全程物流计划</span>
                                </DropdownItem>
                                <DropdownItem v-if="cart.planCode">
                                    <span @click="seePlan(cart)">查看全程物流计划</span>
                                </DropdownItem>
                                <DropdownItem v-if="cart.entrustStatus=='WAIT'">
                                    <span @click="goodsOk(cart)">货好确认</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <div class="public-line1jz" style="margin:6px 0"></div>
                <line-header
                    :lineHeaderData="cart.location"
                    :isBig="false"
                    :cargoTypeTranslate="cart.cargoTypeTranslate"
                    :trspTypeTranslate="cart.trspTypeTranslate"
                ></line-header>
                <div class="card-botton-box-bj">
                    <div class="card-botton-box">
                        <div class="item-l">
                            发货人:
                            <span>{{cart.consigner}}</span>
                        </div>
                        <div class="item-r">
                            收货人:
                            <span>{{cart.consignee}}</span>
                        </div>
                    </div>
                </div>
                <div class="btm">
                    <div class="l">合同编号: {{ cart.contractCode }}</div>
                    <div class="r"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import lineHeader from '../../one-logistics/line-header/index'
import { apiModifyEntrustStatus } from '@/api/logisticsCommission'
import authMixin from '@/mixins/authMixin'
import { isENT, isSALE, isDIS } from '@/libs/roles'
export default {
    name: 'table-cart',
    mixins: [authMixin],
    props: {
        tableList: {
            type: Array,
            default () {
                return []
            },
        },
    },
    components: {
        lineHeader,
    },
    data () {
        return {}
    },
    created () {
    },
    mounted () { },
    methods: {
        // 查看详情
        seeDetail (val) {
            // 跳转到单次的详情
            this.$router.push({
                path: '/logisstics-commission/singleDetail',
                query: {
                    entrustCode: val.entrustCode,
                    executoryEntrustCode: val.executoryEntrustCode,
                    freightReqCode: val.freightReqCode,
                    logisticsSchemeCode: val.logisticsSchemeCode,
                    cargoTypeTranslate: val.cargoTypeTranslate,
                    trspTypeTranslate: val.trspTypeTranslate,
                    lineHeaderData: JSON.stringify(val.location),
                },
            })
        },
        // 编辑
        editHandel (val) {
            this.$router.push({
                path: '/logisstics-commission/edit-one-logistics',
                query: {
                    entrustCode: val.entrustCode,
                    executoryEntrustCode: val.executoryEntrustCode,
                    freightReqCode: val.freightReqCode,
                    logisticsSchemeCode: val.logisticsSchemeCode,
                    cargoTypeTranslate: val.cargoTypeTranslate,
                    trspTypeTranslate: val.trspTypeTranslate,
                    lineHeaderData: JSON.stringify(val.location),
                },
            })
        },
        //货好确认
        goodsOk (item, index) {
            // 已货好
            let data = {
                executoryEntrustCode: item.executoryEntrustCode, //子委托编号
                entrustExecutoryStatus: 'EXECUTE', //子委托状态 进行中
            }
            apiModifyEntrustStatus({
                data,
            }).then(({ data }) => {
                this.$Message.success('操作成功')
                this.$emit('goodOkCal')
            })
        },
        //查看物流全程计划
        seePlan (item, index) {
            if (this.isRoles_m(['ENT'])) {
                // 客户
                console.log('我是客户')
                this.$router.push({
                    path: '/logistics-whole-journey-plan/client-plan',
                    query: {
                        entrustCode: item.entrustCode,
                        entrustExecutoryStatus: item.entrustStatus,
                        planCode: item.planCode,
                    },
                })
            }
            if (this.isRoles_m(['SALE'])) {
                console.log('我是销售')
                // 销售
                this.$router.push({
                    path: '/logistics-whole-journey-plan/sale-plan-detail',
                    query: {
                        planCode: item.planCode,
                    },
                })
            }
            if (this.isRoles_m(['DIS'])) {
                // 调度
                console.log('我是调度')
                this.$router.push({
                    path: '/logistics-whole-journey-plan/plan-detail',
                    query: {
                        planCode: item.planCode,
                    },
                })
            }
        },
        //生成物流全程计划
        addPlan (item) {
            this.$router.push({
                path: '/logistics-whole-journey-plan/generate',
                query: {
                    executoryEntrustCode: item.executoryEntrustCode,
                },
            })
        },
    },
}
</script>

<style scoped lang="scss">
.card-botton-box-bj {
    background: #f5f5f5;
    .card-botton-box {
        height: 40px;
        line-height: 40px;
        margin: 0 18px;
        border-top: #999999 dashed 1px;
        display: flex;
        justify-content: space-between;
    }
}
.public-table-cart-boxjz {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .card-item {
        width: 48%;
        // height: 221px;
        background: rgba(255, 255, 255, 1);
        // box-shadow: 0px 6px 14px 0px rgba(51, 51, 51, 0.1);
        border-radius: 2px;
        margin-bottom: 20px;
    }
    .card-item:hover {
        box-shadow: 0px 6px 14px 0px rgba(51, 51, 51, 0.1);
    }
    .cart-itemjz {
        // width: 496px;
        // height: 177px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 6px 14px 0px rgba(51, 51, 51, 0.1);
        border-radius: 2px;
        padding: 20px;
        .title {
            display: flex;
            justify-content: space-between;
            .l {
                span {
                    &:nth-child(1) {
                        padding-right: 20px;
                    }
                    &:nth-child(2) {
                        width: 43px;
                        height: 16px;
                        border: 1px solid rgba(2, 173, 181, 1);
                        border-radius: 4px;
                        color: rgba(2, 173, 181, 1);
                        font-size: 12px;
                    }
                }
            }
        }
        .main {
            margin-top: 4px;
            width: 455px;
            height: 80px;
            background: rgba(249, 249, 249, 1);
            border-radius: 4px;
            padding: 10px;
            .title {
                .r {
                    display: flex;
                    align-items: center;
                    .huo_che,
                    .lun_chuan {
                        width: 22px;
                        height: 22px;
                    }
                }
            }
            .item-main {
                display: flex;
                align-items: center;
                padding: 6px 0;
                .txt {
                    max-width: 154px;
                    font-size: 20px;
                    color: rgba(51, 51, 51, 1);
                    line-height: 28px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .jiantou {
                    width: 76px;
                    color: $light-color;
                }
            }
        }
        .btm {
            display: flex;
            justify-content: space-between;
            padding: 6px 10px 0px 10px;
        }
    }
}
</style>
