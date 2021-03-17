<template>
    <div>
        <div class="public-table-cart-boxjz">
            <div class="cart-item" v-for="(cart,index) in list" :key="index">
                <div class="cart-itemjz">
                    <div class="title">
                        <div class="l">
                            <span>订单编号：{{ cart.orderCode }}</span>
                            <span>{{ cart.orderStatusTranslate || cart.orderStatus }}</span>
                        </div>
                        <div class="r">
                            <Dropdown>
                                <span style="cursor: pointer;">查看详情</span>
                                <Icon type="ios-arrow-down"></Icon>
                                <DropdownMenu slot="list">
                                    <DropdownItem>
                                        <span @click="seeDetail(cart)">查看详情</span>
                                    </DropdownItem>
                                    <DropdownItem v-if="cart.orderStatus == 'WAIT'">
                                        <span @click="unOrder(cart)">拒绝订单</span>
                                    </DropdownItem>
                                    <DropdownItem v-if="cart.orderStatus == 'WAIT'">
                                        <span @click="okOrder(cart)">接受订单</span>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                    <div class="public-line1jz" style="margin:6px 0"></div>
                    <div class="main">
                        <div class="title">
                            <!-- 这个地方问ui -->
                            <div class="l"></div>
                            <div class="r">
                                <svg class="icon" aria-hidden="true">
                                    <use
                                        v-if="cart.trspMode == '2'"
                                        fill="#FFBB32"
                                        xlink:href="#icon-feiji800"
                                    />
                                    <use
                                        v-if="cart.trspMode == '3'"
                                        fill="#FFBB32"
                                        xlink:href="#icon-huoche"
                                    />
                                    <use
                                        v-if="cart.trspMode == '4'"
                                        fill="#FFBB32"
                                        xlink:href="#icon-andaotongcaidanICON_huoche"
                                    />
                                    <use
                                        v-if="cart.trspMode == '1'"
                                        fill="#FFBB32"
                                        xlink:href="#icon-andaotongcaidanICON_lunchuan"
                                    />>
                                </svg>
                            </div>
                        </div>
                        <div
                            class="item-main"
                            v-if="cart.serverType == '运输' || cart.serverType == 'T'"
                        >
                            <div
                                class="txt"
                                :title="cart.departurePortTranslate"
                            >{{ cart.departurePortTranslate }}</div>
                            <div class="icon">
                                <svg class="iconfont jiantou" aria-hidden="true">
                                    <use xlink:href="#icon-andaotongcaidanICON_jiantou" />
                                </svg>
                            </div>
                            <div
                                class="txt"
                                :title="cart.destinationPortTranslate"
                            >{{ cart.destinationPortTranslate }}</div>
                        </div>
                        <div
                            class="item-main-t"
                            v-if="cart.serverType !== '运输' || cart.serverType !== 'T'"
                        >
                            <div
                                class="txt"
                                :title="cart.serverLocusTranslate"
                            >{{ cart.serverLocusTranslate }}</div>
                        </div>
                    </div>
                    <div class="btm">
                        <div class="l">客户名称：{{ cart.createEtpsName }}</div>
                        <div class="r">货物类型：{{ cart.cargoTypeTranslate }}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 交互 -->
        <order-status ref="orderStatusId" :detailData="detailData"></order-status>
    </div>
</template>

<script>
import orderStatus from '../order-status'
export default {
    name: 'table-cart',
    props: {
        list: {
            type: Array,
            default () {
                return []
            },
        },
    },
    components: {
        orderStatus,
    },
    data () {
        return {
            detailData: {},
        }
    },
    created () { },
    mounted () { },
    methods: {
        unOrder (data) {
            this.detailData = data
            this.$refs.orderStatusId.openDialog()
            this.$emit('updateList')
        },
        okOrder (data) {
            this.$refs.orderStatusId.accept(data)
            this.$emit('updateList')
        },
        // 查看详情
        seeDetail (value) {
            this.$router.push({
                path: '/logisstics-commission/orderDetail',
                query: {
                    // lineHeaderData: JSON.stringify(val.location),
                    orderCode: value.orderCode,
                },
            })
        },
    },
}
</script>

<style scoped lang="scss">
.public-table-cart-boxjz {
    display: flex;
    // justify-content: space-between;
    flex-wrap: wrap;
    .cart-item {
        width: 32%;
        &:nth-child(3n + 2) {
            margin-left: 2%;
            margin-right: 2%;
        }
    }
    .cart-itemjz:hover {
        box-shadow: 0px 6px 14px 0px rgba(51, 51, 51, 0.1);
    }
    .cart-itemjz {
        width: 100%;
        height: 177px;
        background: rgba(255, 255, 255, 1);
        // box-shadow: 0px 6px 14px 0px rgba(51, 51, 51, 0.1);
        border-radius: 2px;
        padding: 20px;
        // margin-right: 50px;
        margin-bottom: 20px;

        .title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
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
                    }
                }
            }
        }
        .main {
            margin-top: 4px;
            width: 100%;
            height: 80px;
            background: rgba(249, 249, 249, 1);
            border-radius: 4px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .title {
                .r {
                    display: flex;
                    align-items: center;
                    .huo_che,
                    .lun_chuan,
                    .icon {
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
            .item-main-t {
                display: flex;
                align-items: center;
                padding: 6px 0;
                .txt {
                    max-width: 400px;
                    font-size: 20px;
                    color: rgba(51, 51, 51, 1);
                    line-height: 28px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
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
